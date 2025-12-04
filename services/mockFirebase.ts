import { Candidate, STAGES } from '../types';

// Initial Mock Data derived from the user's JSON example + extras for demo
const MOCK_CANDIDATES: Candidate[] = [
  {
    legacyId: "1",
    fullName: "ANDRESSA DA SILVA ROCHA",
    email: "andressarocha.arq@gmail.com",
    phone: "51999999999",
    birthDate: "1993-05-26T00:00:00.000Z",
    age: 32,
    photoUrl: "https://picsum.photos/200/200?random=1",
    city: "Santo Antônio da Patrulha",
    state: "RS",
    interestAreas: ["Arquitetura", "Projetos", "Obras"],
    educationLevel: "Ensino Superior Completo",
    educationBackground: "Arquitetura e Urbanismo",
    institution: "UNISINOS",
    experienceSummary: "Agosto de 2019 / atualmente: Arquiteta e Urbanista autônoma...",
    bio: "Habilidade em autocad e sketchup.",
    certifications: "TÉCNICA EM EDIFICAÇÕES",
    sourceOrigin: "Indicação de amigos",
    applicationType: "Banco de Talentos",
    hasDriverLicense: true,
    willingToRelocate: false,
    isCurrentlyStudying: false,
    createdAt: "2020-09-23T17:51:00.000Z",
    pipelineStage: "Inscrito",
    status: "Em andamento",
    tags: ["Indicação", "Autocad"],
    optOutLGPD: false,
    feedbackGiven: false,
    history: [
        { date: new Date().toISOString(), action: 'Candidato inscrito via Forms', user: 'System' }
    ]
  },
  {
    legacyId: "2",
    fullName: "Carlos Eduardo Souza",
    email: "carlos.souza@email.com",
    phone: "51988887777",
    city: "Porto Alegre",
    state: "RS",
    interestAreas: ["Comercial", "Vendas"],
    educationLevel: "Ensino Médio Completo",
    hasDriverLicense: false,
    createdAt: "2023-10-10T10:00:00.000Z",
    pipelineStage: "Inscrito",
    status: "Em andamento",
    tags: ["Vendas", "Proativo"],
    optOutLGPD: false,
    feedbackGiven: false,
    history: []
  },
  {
    legacyId: "3",
    fullName: "Mariana Oliveira",
    email: "mari.oliveira@email.com",
    phone: "51977776666",
    city: "Canoas",
    state: "RS",
    interestAreas: ["Financeiro"],
    educationLevel: "Superior Incompleto",
    hasDriverLicense: true,
    createdAt: "2023-09-15T14:30:00.000Z",
    pipelineStage: "Entrevista I",
    status: "Em andamento",
    tags: ["Excel Avançado"],
    optOutLGPD: false,
    feedbackGiven: false,
    history: [
         { date: "2023-09-15T14:30:00.000Z", action: 'Candidato inscrito', user: 'System' },
         { date: "2023-09-20T10:00:00.000Z", action: 'Movido para Entrevista I', user: 'rodrigo@youngempreendimentos.com.br' }
    ]
  }
];

// Simulating Firestore Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCandidates = async (): Promise<Candidate[]> => {
  await delay(600); // Network delay simulation
  const stored = localStorage.getItem('young_ats_candidates');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('young_ats_candidates', JSON.stringify(MOCK_CANDIDATES));
  return MOCK_CANDIDATES;
};

export const updateCandidate = async (candidate: Candidate, userEmail: string): Promise<Candidate> => {
  await delay(300);
  const candidates = await getCandidates();
  const index = candidates.findIndex(c => c.legacyId === candidate.legacyId);
  
  if (index !== -1) {
    // Add history log entry for update
    const updatedCandidate = {
        ...candidate,
        updatedAt: new Date().toISOString(),
        history: [
            {
                date: new Date().toISOString(),
                action: 'Dados atualizados',
                user: userEmail
            },
            ...(candidate.history || [])
        ]
    };
    candidates[index] = updatedCandidate;
    localStorage.setItem('young_ats_candidates', JSON.stringify(candidates));
    return updatedCandidate;
  }
  throw new Error("Candidate not found");
};

export const deleteCandidate = async (id: string): Promise<void> => {
    await delay(300);
    const candidates = await getCandidates();
    const filtered = candidates.filter(c => c.legacyId !== id);
    localStorage.setItem('young_ats_candidates', JSON.stringify(filtered));
};