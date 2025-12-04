// services/candidateService.ts
import { db } from './firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { Candidate } from '../types';

const COLLECTION = 'candidates';

export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    // Busca candidatos ordenados pela data de criação
    const q = query(collection(db, COLLECTION)); // Pode adicionar orderBy('createdAt', 'desc') se tiver índice
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ legacyId: doc.id, ...doc.data() } as Candidate));
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    return [];
  }
};

export const updateCandidate = async (candidate: Candidate, userEmail: string): Promise<Candidate> => {
  if (!candidate.legacyId) throw new Error("ID do candidato inválido");
  
  const candidateRef = doc(db, COLLECTION, candidate.legacyId);
  
  // Remove o ID do objeto antes de salvar para não duplicar dados dentro do documento
  const { legacyId, ...dataToSave } = candidate;
  
  await updateDoc(candidateRef, dataToSave as any);
  return candidate;
};

export const deleteCandidate = async (id: string): Promise<void> => {
  const candidateRef = doc(db, COLLECTION, id);
  await deleteDoc(candidateRef);
};