// src/services/api.ts

// On vérifie si l'application tourne sur localhost ou sur internet
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_CONFIG = {
  // Si c'est localhost, on utilise le port 8000, sinon on utilise Railway
  baseUrl: isLocalhost 
    ? 'http://localhost:8000/api' 
    : 'https://sweet-joy-production.up.railway.app/api',

  storageUrl: isLocalhost 
    ? 'http://localhost:8000/storage' 
    : 'https://sweet-joy-production.up.railway.app/storage',
};