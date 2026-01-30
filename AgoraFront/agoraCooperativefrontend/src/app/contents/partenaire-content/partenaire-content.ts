import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartenaireService } from '../../services/partenaires';
import { Partenaire } from '../../models/partenaire.model';
import { API_CONFIG } from '../../services/api'; // Import de la config centrale

@Component({
  selector: 'app-partenaire-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partenaire-content.html',
  styleUrl: './partenaire-content.css',
})
export class PartenaireContentComponent implements OnInit {
  partenaires: Partenaire[] = [];
  loading: boolean = true;
  
  // Rendre API_CONFIG disponible pour le template HTML
  public readonly API_CONFIG = API_CONFIG;

  constructor(private partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.fetchPartenaires();
  }

  fetchPartenaires(): void {
    this.loading = true;
    this.partenaireService.getPartenaires().subscribe({
      next: (res) => {
        // Extraction sécurisée des données
        this.partenaires = res.partenaires?.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des partenaires', err);
        this.loading = false;
      }
    });
  }

  /**
   * Gestion du fallback si un logo ne charge pas sur Railway
   */
  handleImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-partner.jpg';
  }

  /**
   * Construit l'URL complète du logo
   */
  getLogoUrl(logoUrl: string | null | undefined): string {
    if (!logoUrl) return 'assets/images/default-partner.jpg';
    
    // Si l'URL est déjà complète (http...), on la retourne
    if (logoUrl.startsWith('http')) return logoUrl;
    
    // Sinon on ajoute le domaine Railway ou Localhost via API_CONFIG
    return `${this.API_CONFIG.storageUrl}/${logoUrl}`;
  }
}