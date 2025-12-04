export type PipelineStage = 
  | 'Inscrito'
  | 'Considerado'
  | 'Entrevista I'
  | 'Testes realizados'
  | 'Entrevista II'
  | 'Selecionado';

export interface Candidate {
  legacyId: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
  age?: number;
  photoUrl?: string;
  
  // Normalized Data
  city: string;
  state: string;
  interestAreas: string[];
  educationLevel?: string;
  
  // Raw Data
  educationBackground?: string;
  institution?: string;
  experienceSummary?: string;
  bio?: string;
  certifications?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  
  // Metadata & Control
  sourceOrigin?: string;
  applicationType?: string;
  hasDriverLicense: boolean;
  willingToRelocate?: boolean;
  isCurrentlyStudying?: boolean;
  createdAt: string;
  updatedAt?: string;
  
  // Internal ATS Fields
  pipelineStage: PipelineStage;
  status: 'Em andamento' | 'Reprovado' | 'Contratado' | 'Standby';
  tags: string[];
  optOutLGPD: boolean;
  
  // Feedback & Notes
  managerFeedback?: string;
  interviewNotes?: string;
  feedbackGiven: boolean;
  
  // Audit Trail (simplified)
  history: Array<{
    date: string;
    action: string;
    user: string;
  }>;
}

export interface User {
  email: string;
  role: 'admin' | 'gestor' | 'user';
  name: string;
  photoURL?: string;
}

export const STAGES: PipelineStage[] = [
  'Inscrito',
  'Considerado',
  'Entrevista I',
  'Testes realizados',
  'Entrevista II',
  'Selecionado'
];