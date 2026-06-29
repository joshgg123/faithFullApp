import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseService";

const USER_ID = "DsKU3kJoDuWZywM8RdRo";

export async function getUserName() {
  const snapshot = await getDoc(
    doc(db, "USUARIO", USER_ID)
  );

  if (!snapshot.exists()) {
    return "";
  }

  return snapshot.data().nombre;
}