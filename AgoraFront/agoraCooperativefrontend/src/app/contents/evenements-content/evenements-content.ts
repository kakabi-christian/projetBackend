import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../models/evenement.model';
import { API_CONFIG } from '../../services/api'; // On importe la config centrale

@Component({
  selector: 'app-evenements-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evenements-content.html',
  styleUrls: ['./evenements-content.css'],
})
export class EvenementsContent implements OnInit, OnDestroy {
  evenements: Evenement[] = [];
  evenementsFiltres: Evenement[] = [];
  filtre: 'tous' | 'planifie' | 'termine' = 'tous';
  isLoading = true;
  error: string | null = null;

  // On utilise la constante globale au lieu du localhost en dur
  readonly storageUrl = API_CONFIG.storageUrl;

  constructor(private evenementService: EvenementService) {}

  ngOnInit(): void {
    this.loadEvenements();
  }

  loadEvenements(): void {
    this.isLoading = true;
    this.evenementService.getEvenements().subscribe({
      next: (res) => {
        // Adaptation selon la structure de ta réponse API
        this.evenements = res.evenements?.data || [];
        this.applyFiltre();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur événements:', err);
        this.error = 'Impossible de charger les événements.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Diagnostic et fallback pour les images d'événements
   */
  handleImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-event.jpg';
  }

  setFiltre(f: 'tous' | 'planifie' | 'termine') {
    this.filtre = f;
    this.applyFiltre();
  }

  applyFiltre() {
    if (this.filtre === 'tous') {
      this.evenementsFiltres = this.evenements;
    } else {
      this.evenementsFiltres = this.evenements.filter(e => e.statut === this.filtre);
    }
  }

  /**
   * Génère l'URL correcte en fonction de l'environnement (Local vs Cloud)
   */
  getEventImage(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/default-event.jpg';
    
    // Si l'URL commence déjà par http, on la laisse tel quel
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Sinon, on concatène avec la base URL (Railway ou Localhost)
    return `${this.storageUrl}/${imageUrl}`;
  }

  getStatutClass(statut: string): string {
    const map: { [key: string]: string } = {
      planifie: 'status-planifie',
      en_cours: 'status-en-cours',
      termine: 'status-termine'
    };
    return map[statut] || '';
  }

  formatDate(dateStr: string) {
    if (!dateStr) return { day: '--', month: '---' };
    const date = new Date(dateStr);
    const months = ['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'];
    return { 
      day: date.getDate().toString().padStart(2,'0'), 
      month: months[date.getMonth()] 
    };
  }

  ngOnDestroy(): void {}
}