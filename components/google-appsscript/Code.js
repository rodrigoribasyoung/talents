/*
 * YOUNG TALENTS ATS - INTEGRATION SCRIPT
 * Conecta Google Forms ao Firebase Firestore
 * Requer biblioteca: 1VUSl4b1r1eoNcRWotZCqqeN-pFaqxFWn_xzjTXkDKkg (FirestoreApp)
 */

// --- CONFIGURAÇÕES (PREENCHA AQUI) ---
const CONFIG = {
  email: "cole-aqui-o-client-email-do-json@app-spot.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nCOLE AQUI A CHAVE INTEIRA...\n-----END PRIVATE KEY-----\n",
  projectId: "id-do-seu-projeto-firebase"
};

// --- FUNÇÃO PRINCIPAL (Gatilho) ---
function onFormSubmit(e) {
  // 1. Inicializa Firestore
  const firestore = getFirestore();
  
  // 2. Segurança: Se rodar manualmente sem dados, para.
  if (!e || !e.namedValues) {
    Logger.log("Erro: Função rodada manualmente sem dados do formulário.");
    return;
  }

  const responses = e.namedValues;
  
  // 3. Mapeamento (Forms -> Firestore Schema)
  // Nota: Usamos [0] porque o Forms retorna arrays de strings
  const candidateData = {
    // --- Metadados Automáticos ---
    createdAt: new Date().toISOString(),
    legacyId: "", // Novos candidatos não tem ID legado
    sourceOrigin: getVal(responses, 'Onde você nos encontrou?') || "Google Forms",
    
    // --- Dados Pessoais ---
    fullName: getVal(responses, 'Nome completo:'),
    email: getVal(responses, 'E-mail principal:'),
    phone: getVal(responses, 'Nº telefone celular / Whatsapp:'),
    birthDate: getVal(responses, 'Data de Nascimento:'), // O Frontend deve tratar formato
    age: parseInt(getVal(responses, 'Idade')) || 0,
    maritalStatus: getVal(responses, 'Estado civil:'),
    childrenCount: parseInt(getVal(responses, 'Se tem filhos, quantos?')) || 0,
    
    // --- Endereço (Limpeza básica) ---
    city: normalizeCity(getVal(responses, 'Cidade onde reside:')),
    
    // --- Profissional & Educacional ---
    educationLevel: getVal(responses, 'Nível de escolaridade:'),
    institution: getVal(responses, 'Instituição de ensino:'),
    educationBackground: getVal(responses, 'Formação:'),
    graduationDate: getVal(responses, 'Data de formatura:'),
    isCurrentlyStudying: checkBoolean(getVal(responses, 'Em caso de curso superior, está cursando neste momento?')),
    certifications: getVal(responses, 'Cursos e certificações profissionais.') || getVal(responses, 'Certificações profissionais:'),
    experienceSummary: getVal(responses, 'Experiências anteriores:'),
    
    // --- Arquivos (Links) ---
    photoUrl: getVal(responses, 'Nos envie uma foto atual que você goste:'),
    resumeUrl: getVal(responses, 'Anexar currículo:'),
    portfolioUrl: getVal(responses, 'Portfólio de trabalho:'),
    
    // --- Perfil & Preferências ---
    interestAreas: normalizeInterests(getVal(responses, 'Áreas de interesse profissional')),
    bio: getVal(responses, 'Campo Livre, SEJA VOCÊ!'),
    applicationType: getVal(responses, 'Você está se candidatando a uma vaga específica ou apenas quer se inscrever no banco de talentos?'),
    salaryExpectation: getVal(responses, 'Qual seria sua expectativa salarial?'),
    referralName: getVal(responses, 'Você foi indicado por algum colaborador da Young? Se sim, quem?'),
    references: getVal(responses, 'Referências profissionais:'),
    
    // --- Logística ---
    hasDriverLicense: checkBoolean(getVal(responses, 'Você possui CNH tipo B?')),
    willingToRelocate: checkBoolean(getVal(responses, 'Teria disponibilidade para mudança de cidade?')),
    
    // --- Campos de Controle Interno (ATS Defaults) ---
    status: "Em andamento",
    pipelineStage: "Inscrito", // Sempre entra na primeira etapa
    tags: ["Novo Inscrito"],
    optOutLGPD: checkBoolean(getVal(responses, 'Não quer ser contatado')) // Caso adicione no futuro
  };

  try {
    // 4. Envia para o Firestore (Coleção 'candidates')
    firestore.createDocument("candidates", candidateData);
    Logger.log("Sucesso: Candidato " + candidateData.fullName + " salvo no Firestore.");
  } catch (error) {
    Logger.log("Erro ao salvar no Firestore: " + error);
    // Opcional: Enviar email para admin avisando do erro
    MailApp.sendEmail("rodrigo@youngempreendimentos.com.br", "Erro ATS Young", "Erro ao salvar resposta: " + error);
  }
}

// --- HELPER FUNCTIONS ---

// Função segura para pegar valores (evita undefined)
function getVal(responses, key) {
  if (responses && responses[key] && responses[key][0]) {
    return responses[key][0].trim();
  }
  return "";
}

// Normaliza boleanos (Sim/Não -> true/false)
function checkBoolean(value) {
  if (!value) return false;
  const v = value.toLowerCase();
  return v.includes('sim') || v.includes('yes') || v === 'true';
}

// Normaliza Lista de Interesses (String -> Array)
function normalizeInterests(rawString) {
  if (!rawString) return [];
  // Separa por vírgula e remove espaços
  return rawString.split(',').map(function(item) {
    return item.trim();
  });
}

// Normaliza Cidade (Remove /RS, - SP, etc) para ficar limpo no Kanban
function normalizeCity(city) {
  if (!city) return "";
  let clean = city.split('/')[0]; // Remove o estado após barra
  clean = clean.split('-')[0];    // Remove o estado após traço
  return clean.trim();
}

// Conexão Auth
function getFirestore() {
  return FirestoreApp.getFirestore(CONFIG.email, CONFIG.key, CONFIG.projectId);
}