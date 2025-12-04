<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Young Talents (ATS)

## 📋 Sobre o Projeto

**Young Talents** é um sistema de gerenciamento de recrutamento e seleção (ATS - Applicant Tracking System) desenvolvido para a Young Empreendimentos. A aplicação centraliza o processo de recrutamento, desde a captação de candidatos até a contratação, oferecendo ferramentas de gerenciamento de pipeline, análise de dados e automação de processos.

## 🎯 Objetivo

O sistema tem como objetivo principal:

- **Gerenciar candidatos** de forma centralizada e organizada
- **Automatizar disparos de email** mediante movimentação na pipeline de recrutamento
- **Exigir campos obrigatórios** por etapa da pipeline para garantir qualidade dos dados
- **Emitir relatórios** e análises sobre o processo de recrutamento
- **Realizar filtros avançados** para busca e monitoramento de candidatos
- **Incluir sistema de tarefas** para acompanhamento de atividades

## 🏗️ Arquitetura e Tecnologias

### Stack Principal

- **React 18.2.0** - Biblioteca JavaScript para construção da interface
- **TypeScript** - Tipagem estática para maior segurança e manutenibilidade
- **Vite 5.1.4** - Build tool e dev server de alta performance
- **Tailwind CSS 3.4.1** - Framework CSS utility-first para estilização
- **React Router DOM 6.22.1** - Roteamento de páginas

### Backend e Serviços

- **Firebase 10.8.0**
  - **Firestore** - Banco de dados NoSQL para armazenamento de candidatos, vagas e configurações
  - **Authentication** - Autenticação via Google (@youngempreendimentos.com.br) e Email
  - **Storage** - Armazenamento de imagens (logos, elementos personalizados)

- **Google Apps Script**
  - Integração com Google Forms para captação automática de candidatos
  - Envio de lotes de dados para o Firebase
  - Sincronização em tempo real de novas entradas do formulário

### Deploy e Versionamento

- **Vercel** - Plataforma de deployment e hospedagem
- **GitHub** - Controle de versão e colaboração

### Bibliotecas Auxiliares

- **Recharts 2.12.0** - Gráficos e visualizações de dados
- **Lucide React 0.344.0** - Ícones modernos
- **clsx & tailwind-merge** - Utilitários para classes CSS condicionais

## 🎨 Identidade Visual

- **Tema**: Suporte a Dark/Light Theme
- **Cores principais**:
  - `#fe5009` (Laranja)
  - `#00bcbc` (Ciano)
- **Tipografia**:
  - Space Grotesk
  - Be Vietnam Pro
- **Elementos visuais**: Gráficos coloridos utilizando paleta do Google

## 📐 Estrutura de Funcionalidades

### 1. Dashboard

Painel principal com visão geral do processo de recrutamento:

- **Barra lateral**: Exibição de candidatos por etapa da pipeline
- **Scorecards** (KPIs):
  - Contratados
  - Reprovados
  - Total de candidatos
  - Taxa de conversão
  - Entrevistas realizadas
  - Testes realizados
  - Retornos pendentes
- **Gráficos de Pizza**:
  - Origem (como ficou sabendo da vaga)
  - Cidade de residência
  - Área de interesse
- **Listas**:
  - Top 10 novos inscritos
  - Top 10 próximas entrevistas
  - Top 10 últimas atualizações

### 2. Candidatos

Módulo de gerenciamento de candidatos:

- **Filtros avançados** (sidebar) com opção de salvar filtros personalizados
- **Busca global** (nome, tags, termos gerais)
- **Classificação**: alfabética, por data, atualização mais recente/antiga
- **Filtros de data**: padronizados e personalizados

### 3. Pipeline

Visualização e gerenciamento do funil de recrutamento:

- **Modos de visualização**:
  - Kanban (quadros)
  - Lista
- **Paginação**: 5, 10, 25, 50, 100, 500, 1000 candidatos por página
- **Resumo por etapa**: número de candidatos sem carregar todos
- **Filtros avançados** (sidebar) com salvamento de filtros
- **Ações rápidas**: Botão para Ganho/Perda (modifica status do candidato)

### 4. Vagas

Gerenciamento de oportunidades:

- **Abertura de vaga**: Formulário completo para criação
- **Gerenciamento**:
  - Lista de vagas abertas com candidatos aplicados
  - Filtros e classificação
- **Controles**: Botão de fechamento/abertura no card da vaga
- **Status visível**: Data de criação e atualização

### 5. Relatórios

- **Exportação de dados** em formato CSV

### 6. Campanhas

- **Template de solicitação** de campanha para o marketing
- **Integração com Google Forms** do marketing para envio de solicitações

### 7. Configurações

Painel administrativo para customização do sistema:

#### 7.1. Configuração de Campos

**Candidatos**:
- **Seção I** (Campos padrão):
  - Campos iniciais do sistema
  - Tags
  - Visibilidade
  - Obrigatoriedade
  - ID único
  - Botões de edição/exclusão
- **Seção II** (Campos personalizados):
  - Criação, edição e exclusão de campos customizados

**Vagas**:
- **Seção I** (Campos padrão):
  - Cidades
  - Empresas
  - Áreas
  - Setores
  - Cargos
  - Status da vaga (Aberta, Fechada, Pausada)
  - Tags
  - Visibilidade
  - Obrigatoriedade
  - ID único
  - Botões de edição/exclusão
- **Seção II** (Campos personalizados):
  - Criação, edição e exclusão de campos customizados

#### 7.2. Usuários

- Tabela de usuários com opções de edição e exclusão

#### 7.3. Ações em Massa

- Importar/Exportar CSV
- Transferências de dados

#### 7.4. Templates de Email

- Criação de templates para disparo automático mediante movimentação na pipeline

#### 7.5. Pipeline

- **Configuração de Etapas** do funil
- **Configuração de Status** do funil
- **Configuração de Motivos de Fechamento**
- **Bloqueios de etapas**:
  - Exigência de campos obrigatórios (texto ou preenchimento)
  - Validação de dados por etapa

### 8. Ajuda

- README para usuário
- README para desenvolvedor
- Botões de atalho para desenvolvedores (GitHub, Firebase, Vercel, etc.)

## 🚀 Estado Atual do Projeto

O projeto está em desenvolvimento ativo. A estrutura base foi criada com:

- Configuração inicial do React + TypeScript + Vite
- Integração com Firebase (configuração de autenticação e banco de dados)
- Estrutura de componentes e páginas iniciais
- Sistema de roteamento
- Context API para gerenciamento de estado de autenticação
- Integração com Google Apps Script para sincronização de formulários

## 📦 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta Firebase configurada
- Google Apps Script configurado (para integração com formulários)

### Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 🔗 Links e Recursos

- **Google Apps Script**: [Projeto de Integração](https://script.google.com/u/0/home/projects/1zXmSstnSgFbKQdenOH2SNcK_NQm501u5mO2rEgf8D0ZppnBpcEuTDC13/edit)
- **Firebase**: Configuração de autenticação e Firestore
- **Vercel**: Deploy e hospedagem
- **GitHub**: Repositório e versionamento

## 📝 Próximos Passos

- [ ] Implementação completa do Dashboard com scorecards e gráficos
- [ ] Sistema de filtros avançados para candidatos
- [ ] Visualização Kanban e Lista da Pipeline
- [ ] Módulo completo de gerenciamento de vagas
- [ ] Sistema de templates de email
- [ ] Configurações avançadas de campos e pipeline
- [ ] Sistema de tarefas
- [ ] Documentação completa para usuários e desenvolvedores

## 👥 Contribuição

Este é um projeto interno da Young Empreendimentos. Para contribuições, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido para Young Empreendimentos** 🚀
