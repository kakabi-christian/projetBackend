// On vérifie l'environnement
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Base URL du serveur (sans le /api à la fin)
const SERVER_URL = isLocalhost 
  ? 'http://localhost:8000' 
  : 'https://agorapp.up.railway.app';

export const API_CONFIG = {
  // Pour les appels aux routes Laravel
  apiUrl: `${SERVER_URL}/api`,

  // Pour les images (On s'arrête au domaine car la DB fournit "storage/projets/...")
  storageUrl: SERVER_URL,
};