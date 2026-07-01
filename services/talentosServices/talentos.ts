import { db } from "@/services/firebaseService";
import { Article } from "@/types/talentos/article";
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

// ⚠️ Copiá EXACTO el mecanismo de usuario que use tesoros.ts.
const USER_ID = "DsKU3kJoDuWZywM8RdRo"; // <- reemplazar por el de tesoros.ts

export async function getArticles(): Promise<Article[]> {
  const snap = await getDocs(collection(db, "CONTENT"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, "id">) }));
}

export async function getArticleById(id: string): Promise<Article | null> {
  const ref = doc(db, "CONTENT", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Article, "id">) };
}

// export async function getUserInterests(): Promise<string[]> {
//   const ref = doc(db, "USUARIO", USER_ID);
//   const snap = await getDoc(ref);
//   return (snap.data()?.interests as string[]) ?? [];
// }

// export async function getOnboardingCompleted(): Promise<boolean> {
//   const ref = doc(db, "USUARIO", USER_ID);
//   const snap = await getDoc(ref);
//   return Boolean(snap.data()?.onboardingCompleted);
// }

export async function getUserTalentProfile() {
    const ref = doc(db, "USUARIO", USER_ID);

    const snap = await getDoc(ref);

    if (!snap.exists()) {
        return {
            interests: [],
            onboardingCompleted: false,
            leidos: [],
        };
    }

    const data = snap.data();

    return {
        interests: data.interests ?? [],
        onboardingCompleted: data.onboardingCompleted ?? false,
        leidos: data.leidos ?? [],
    };
}

export async function saveUserInterests(interests: string[]): Promise<void> {
  const ref = doc(db, "USUARIO", USER_ID);
  await setDoc(ref, { interests, onboardingCompleted: true }, { merge: true });
}

export async function guardarArticuloLeido(
  titulo: string
): Promise<void> {
  const ref = doc(db, "USUARIO", USER_ID);

  await updateDoc(ref, {
    leidos: arrayUnion(titulo),
  });
}


// import { db } from "@/services/firebaseService";
// import { Article } from "@/types/talentos/article";
// import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";


// // ⚠️ Copiá EXACTO el mecanismo de usuario que use tesoros.ts.
// const USER_ID = "DsKU3kJoDuWZywM8RdRo"; // <- reemplazar por el de tesoros.ts

// export async function getArticles(): Promise<Article[]> {
//   const snap = await getDocs(collection(db, "CONTENT"));
//   return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, "id">) }));
// }

// export async function getArticleById(id: string): Promise<Article | null> {
//   const ref = doc(db, "CONTENT", id);
//   const snap = await getDoc(ref);
//   if (!snap.exists()) return null;
//   return { id: snap.id, ...(snap.data() as Omit<Article, "id">) };
// }

// export async function getUserInterests(): Promise<string[]> {
//   const ref = doc(db, "USUARIO", USER_ID);
//   const snap = await getDoc(ref);
//   return (snap.data()?.intereses as string[]) ?? [];
// }

// export async function getOnboardingCompleted(): Promise<boolean> {
//   const ref = doc(db, "USUARIO", USER_ID);
//   const snap = await getDoc(ref);
//   return Boolean(snap.data()?.onboardingCompleted);
// }

// export async function saveUserInterests(intereses: string[]): Promise<void> {
//   const ref = doc(db, "USUARIO", USER_ID);
//   await setDoc(ref, { intereses, onboardingCompleted: true }, { merge: true });
// }

// export async function guardarArticuloLeido(titulo: string): Promise<void> {
//   // Reemplaza USER_ID con la forma en que obtienes tu usuario (el que usamos en saveUserInterests)
//   const USER_ID = "DsKU3kJoDuWZywM8RdRo"; 
//   const ref = doc(db, "USUARIO", USER_ID);
  
//   await updateDoc(ref, {
//     leidos: arrayUnion(titulo)
//   });
// }

// import { db } from "@/services/firebaseService"; // Asegúrate de que esta ruta a tu base de datos sea correcta
// import { Article } from "@/types/talentos/article";
// import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

// // ⚠️ Usamos los IDs exactos de tu captura de pantalla.
// const USER_ID = "DsKU3kJoDuWZywM8RdRo";
// const TALENTOS_ID = "52i9P9VxUpFGoVTvA8AS";

// // 1. Obtener todos los artículos de CONTENT
// export async function getArticles(): Promise<Article[]> {
//   try {
//     const querySnapshot = await getDocs(collection(db, "CONTENT"));
//     const articles: Article[] = [];
    
//     querySnapshot.forEach((doc) => {
//       articles.push({ id: doc.id, ...doc.data() } as Article);
//     });
    
//     return articles;
//   } catch (error) {
//     console.error("Error al descargar artículos:", error);
//     return [];
//   }
// }

// // 2. Obtener intereses del usuario
// export async function getUserInterests(): Promise<string[]> {
//   try {
//     const ref = doc(db, "USUARIO", USER_ID, "talentos", TALENTOS_ID);
//     const docSnap = await getDoc(ref);
    
//     if (docSnap.exists() && docSnap.data().interests) {
//       return docSnap.data().interests;
//     }
//     return [];
//   } catch (error) {
//     console.error("Error al descargar intereses:", error);
//     return [];
//   }
// }

// // 3. Validar si ya hizo la encuesta
// export async function getOnboardingCompleted(): Promise<boolean> {
//   try {
//     const ref = doc(db, "USUARIO", USER_ID, "talentos", TALENTOS_ID);
//     const docSnap = await getDoc(ref);
    
//     if (docSnap.exists()) {
//       return docSnap.data().testCompleted === true;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error al validar onboarding:", error);
//     return false;
//   }
// }

// // 4. Guardar las respuestas de la encuesta (Onboarding)
// export async function saveUserInterests(interests: string[]): Promise<void> {
//   try {
//     const ref = doc(db, "USUARIO", USER_ID, "talentos", TALENTOS_ID);
    
//     await updateDoc(ref, {
//       interests: interests,
//       testCompleted: true,
//       updatedAt: new Date()
//     });
//     console.log("¡Intereses guardados con éxito en Firebase!");
//   } catch (error) {
//     console.error("Error al guardar intereses:", error);
//   }
// }

// // 5. Función para el detalle del artículo
// export async function getArticleById(id: string): Promise<Article | null> {
//   try {
//     const docRef = doc(db, "CONTENT", id);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       return { id: docSnap.id, ...docSnap.data() } as Article;
//     }
//     return null;
//   } catch (error) {
//     console.error("Error al obtener el artículo:", error);
//     return null;
//   }
// }

// // 6. Guardar en leídos
// export async function guardarArticuloLeido(titulo: string): Promise<void> {
//   try {
//     const ref = doc(db, "USUARIO", USER_ID, "talentos", TALENTOS_ID);
//     await updateDoc(ref, {
//       leidos: arrayUnion(titulo)
//     });
//   } catch (error) {
//     console.error("Error al guardar en leídos:", error);
//   }
// }



// pendiendete

//Todavía NO vamos a guardar en leidos. Lo haremos cuando la pantalla ya funcione.