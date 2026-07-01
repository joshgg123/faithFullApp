// export type Article = {
//   id: string;
//   title: string;
//   author: string;
//   content: string;     // markdown
//   category: string;
//   coverImage?: string;
//   createdAt: string;
// };

// export interface Article {
//   id: string;
//   title: string;
//   category: string;
//   imageUrl: string; // O como tengas llamada la imagen en tu código original
  
//   // ¡Agregamos lo que añadimos en Firebase por el Camino A!
//   excerpt: string;
//   verse: string;
//   readTime: string;
//   tags: string[];
//   // 👇 AGREGAR ESTA LÍNEA 👇
//   createdAt?: any; // Usamos 'any' para aceptar tanto el Timestamp de Firebase como Date o string
//   markdownBody?: string;
// }


// modificado

export interface Article {
  id: string;

  title: string;

  description: string;

  type: "article" | "video";

  image: string;

  videoUrl?: string;

  category: string;

  tags: string[];

  source: string;

  createdAt: any;

  markdownBody: string;
}