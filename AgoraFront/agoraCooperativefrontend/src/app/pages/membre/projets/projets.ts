import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { API_CONFIG } from '../../../services/api';

@Component({
  selector: 'app-membre-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projets.html',
  styleUrl: './projets.css'
})
export class ProjetsMembre implements OnInit {
  loading = true;
  errorMessage: string | null = null;
  projets: any[] = [];
  paginationMeta: any = null;
  page = 1;
  mesParticipations: any[] = [];

  constructor(private projetService: ProjetService) { }

  ngOnInit(): void {
    console.log('%c [Diagnostic] Initialisation du composant Membre ', 'background: #222; color: #bada55');
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;

    console.group(`Chargement des projets - Page ${this.page}`);
    
    this.projetService.getProjets(this.page).subscribe({
      next: (res: any) => {
        console.log('1. Réception Backend (Brut):', res);
        
        // Extraction des données
        this.projets = res.projets?.data || res.data || (Array.isArray(res) ? res : []);
        this.paginationMeta = res.projets || res;

        console.log('2. Projets extraits (Array):', this.projets);
        console.log('3. Meta pagination:', this.paginationMeta);

        if (this.projets.length === 0) {
          console.warn('ATTENTION : La liste des projets est vide. Vérifiez si "est_public" est à 1 en BD.');
        }

        this.loading = false;
        console.groupEnd();
      },
      error: (err) => {
        console.error('ERREUR CRITIQUE CHARGEMENT:', err);
        this.errorMessage = 'Impossible de charger les projets.';
        this.loading = false;
        console.groupEnd();
      }
    });

    this.projetService.mesParticipations().subscribe({
      next: (res: any) => {
        this.mesParticipations = res?.data || res?.participations || res || [];
        console.log('4. Participations Membre:', this.mesParticipations);
      }
    });
  }

  /**
   * Diagnostic spécifique pour les images
   */
  getImageUrl(path: string | null): string {
    console.groupCollapsed(`Image Log: ${path ? path.substring(0, 20) + '...' : 'NUL'}`);
    
    if (!path) {
      console.log('Résultat: Image par défaut (Path vide)');
      console.groupEnd();
      return 'assets/default-project.jpg';
    }

    if (path.startsWith('http')) {
      console.log('Résultat: URL Directe (Cloud)');
      console.groupEnd();
      return path;
    }

    const fullUrl = `${API_CONFIG.storageUrl}/${path}`;
    console.log('Storage URL:', API_CONFIG.storageUrl);
    console.log('Path final:', fullUrl);
    console.groupEnd();
    
    return fullUrl;
  }

  // Les autres méthodes restent identiques...
  nextPage(): void {
    if (this.paginationMeta && this.page < this.paginationMeta.last_page) {
      this.page++;
      this.load();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  getProjectTypeClass(type: string): string {
    const t = type?.toLowerCase() || '';
    if (t.includes('innovation')) return 'type-innovation';
    if (t.includes('agricole')) return 'type-agriculture';
    if (t.includes('social')) return 'type-social';
    return 'type-default';
  }

  getProjectTypeIcon(type: string): string {
    const t = type?.toLowerCase() || '';
    if (t.includes('innovation')) return 'bi-lightbulb-fill';
    if (t.includes('agricole')) return 'bi-tree-fill';
    if (t.includes('social')) return 'bi-people-fill';
    return 'bi-clipboard-check-fill';
  }

  getStatusClass(statut: string): string {
    const s = statut?.toLowerCase() || '';
    if (s.includes('actif') || s.includes('en_cours')) return 'status-actif';
    if (s.includes('termine')) return 'status-termine';
    if (s.includes('propose')) return 'status-en-attente';
    return 'status-en-cours';
  }

  truncateDescription(description: string, maxLength: number = 120): string {
    if (!description) return '';
    return description.length <= maxLength ? description : description.substring(0, maxLength) + '...';
  }
}