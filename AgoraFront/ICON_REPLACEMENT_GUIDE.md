# Guide de Remplacement des Icônes - Bootstrap Icons

Ce document liste tous les remplacements d'emojis par des icônes Bootstrap Icons dans le projet.

## Installation

Bootstrap Icons est déjà installé et importé dans `src/styles.css`.

## Syntaxe

Remplacer les emojis par : `<i class="bi bi-[nom-icone]"></i>`

## Table de Correspondance

| Emoji | Bootstrap Icon | Classe CSS | Usage |
|-------|----------------|------------|-------|
| 👥 | People | `bi bi-people-fill` | Membres, participants |
| 🚀 | Rocket | `bi bi-rocket-takeoff-fill` | Projets, lancement |
| 🎯 | Target | `bi bi-bullseye` | Objectifs, événements |
| 💚 | Heart | `bi bi-heart-fill` | Dons, favoris |
| ⏳ | Hourglass | `bi bi-hourglass-split` | Chargement, attente |
| 🤝 | Handshake | `bi bi-people-fill` ou `bi bi-hand-thumbs-up-fill` | Solidarité, participation |
| 🌍 | Globe | `bi bi-globe-americas` | Durabilité, international |
| ⚖️ | Balance | `bi bi-balance-scale` | Équité, justice |
| 💡 | Lightbulb | `bi bi-lightbulb-fill` | Innovation, idées |
| 📅 | Calendar | `bi bi-calendar-event-fill` | Dates, événements |
| 📍 | Pin | `bi bi-geo-alt-fill` | Localisation, lieu |
| ✓ | Check | `bi bi-check-circle-fill` | Validation, succès |
| ⚠️ | Warning | `bi bi-exclamation-triangle-fill` | Alerte, erreur |
| 📱 | Phone | `bi bi-telephone-fill` | Contact téléphone |
| ✉️ | Email | `bi bi-envelope-fill` | Email, messages |
| 🔒 | Lock | `bi bi-lock-fill` | Sécurité, mot de passe |
| 🔓 | Unlock | `bi bi-unlock-fill` | Déverrouillage |
| 📊 | Chart | `bi bi-bar-chart-fill` | Statistiques, graphiques |
| 💰 | Money | `bi bi-cash-coin` | Finance, paiement |
| 🏆 | Trophy | `bi bi-trophy-fill` | Réussite, top |
| 📄 | Document | `bi bi-file-earmark-text-fill` | Documents, fichiers |
| 🔍 | Search | `bi bi-search` | Recherche |
| ⚙️ | Settings | `bi bi-gear-fill` | Paramètres, configuration |
| 🏠 | Home | `bi bi-house-fill` | Accueil |
| 📈 | Trending Up | `bi bi-graph-up-arrow` | Croissance, progression |
| 📉 | Trending Down | `bi bi-graph-down-arrow` | Baisse, régression |
| 🔔 | Bell | `bi bi-bell-fill` | Notifications |
| 👤 | Person | `bi bi-person-fill` | Utilisateur, profil |
| 🗂️ | Folder | `bi bi-folder-fill` | Dossiers, catégories |
| 📎 | Paperclip | `bi bi-paperclip` | Pièces jointes |
| 🖼️ | Image | `bi bi-image-fill` | Images, photos |
| 🎨 | Palette | `bi bi-palette-fill` | Design, couleurs |
| 📝 | Memo | `bi bi-pencil-square` | Édition, notes |
| 🗑️ | Trash | `bi bi-trash-fill` | Suppression |
| ➕ | Plus | `bi bi-plus-circle-fill` | Ajout, création |
| ➖ | Minus | `bi bi-dash-circle-fill` | Retrait, réduction |
| ↗️ | Arrow Up Right | `bi bi-arrow-up-right` | Lien externe |
| ⬇️ | Download | `bi bi-download` | Téléchargement |
| ⬆️ | Upload | `bi bi-upload` | Upload, envoi |
| 🔄 | Refresh | `bi bi-arrow-clockwise` | Actualisation |
| ❌ | X | `bi bi-x-circle-fill` | Fermeture, annulation |
| ℹ️ | Info | `bi bi-info-circle-fill` | Information |
| 🌟 | Star | `bi bi-star-fill` | Favoris, important |
| 📦 | Package | `bi bi-box-seam-fill` | Ressources, packages |

## Fichiers à Modifier

### Priorité 1 - Pages Publiques
- ✅ `src/app/contents/home-content/home-content.html` (Partiellement fait)
- `src/app/contents/projets-content/projets-content.html`
- `src/app/contents/evenements-content/evenements-content.html`
- `src/app/footer/footer.html`
- `src/app/header/header.html`

### Priorité 2 - Espace Membre
- `src/app/pages/membre/profil/profil.html`
- `src/app/pages/membre/projets/projets.html`
- `src/app/pages/membre/projets/detail/detail.html`
- `src/app/pages/membre/evenements/evenements.html`
- `src/app/pages/membre/evenements/detail/detail.html`
- `src/app/pages/membre/ressources/ressources.html`
- `src/app/pages/membre/historique/historique.html`
- `src/app/pages/membre/tableau-de-bord/tableau-de-bord.html`

### Priorité 3 - Espace Admin
- `src/app/pages/admin/home/home.html`
- `src/app/pages/admin/stats/stats.html`
- `src/app/pages/admin/demande/demande.html`
- `src/app/pages/admin/project/project.html`
- `src/app/pages/admin/evenement/evenement.html`
- `src/app/components/admin/sidebar/sidebar.html`

## Exemples de Remplacement

### Avant
```html
<span class="banner-icon">👥</span>
<div class="feature-icon">🤝</div>
<i class="alert-icon">⚠️</i>
```

### Après
```html
<span class="banner-icon"><i class="bi bi-people-fill"></i></span>
<div class="feature-icon"><i class="bi bi-people-fill"></i></div>
<i class="alert-icon"><i class="bi bi-exclamation-triangle-fill"></i></i>
```

## Styles CSS

Les icônes Bootstrap héritent de la taille et couleur du texte parent. Pour personnaliser :

```css
.banner-icon i {
  font-size: 2.5rem;
  color: var(--color-primary);
}

.feature-icon i {
  font-size: 2rem;
}
```

## Ressources

- Documentation Bootstrap Icons : https://icons.getbootstrap.com/
- Recherche d'icônes : https://icons.getbootstrap.com/#icons
