import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/services/firebaseService';
import { Task } from '@/types/tiempo/task';

/*
 * TODO: reemplazar por auth.currentUser.uid
 */
const USER_ID = 'DsKU3kJoDuWZywM8RdRo'; // Harcodeado por ahora

const tasksCollection = collection(db, 'USUARIO', USER_ID, 'tareas');

/* ==========================================
   TASKS
========================================== */

export async function getTasks(): Promise<Task[]> {
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Task, 'id'>),
  }));
}

export async function createTask(data: Omit<Task, 'id'>): Promise<void> {
  await addDoc(tasksCollection, data);
}

export async function updateTask(
  taskId: string,
  data: Partial<Omit<Task, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, 'USUARIO', USER_ID, 'tareas', taskId), data);
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, 'USUARIO', USER_ID, 'tareas', taskId));
}