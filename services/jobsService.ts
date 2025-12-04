import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { Job } from '../types';

const COLLECTION = 'jobs';

export const getJobs = async (): Promise<Job[]> => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    return [];
  }
};

export const createJob = async (job: Omit<Job, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), job);
  return docRef.id;
};

export const updateJobStatus = async (id: string, status: Job['status']) => {
  const jobRef = doc(db, COLLECTION, id);
  await updateDoc(jobRef, { status });
};