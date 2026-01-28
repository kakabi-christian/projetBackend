//src/services/api.ts
export const API_CONFIG = {
  baseUrl: 'https://agorapp.up.railway.app/api',
  // Tu peux aussi ajouter l'URL de base pour les images/logos ici
  storageUrl: 'https://agorapp.up.railway.app/storage'
};

// src/app/services/api.ts

// On vérifie si l'application tourne sur localhost ou sur internet
// const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// export const API_CONFIG = {
//   // Si c'est localhost, on utilise le port 8000, sinon on utilise Railway
//   baseUrl: isLocalhost 
//     ? 'http://localhost:8000/api' 
//     : 'https://agorapp.up.railway.app/api',

//   storageUrl: isLocalhost 
//     ? 'http://localhost:8000/storage' 
//     : 'https://agorapp.up.railway.app/storage',
// };