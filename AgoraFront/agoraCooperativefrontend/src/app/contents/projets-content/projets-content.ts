import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  DashboardService, 
  DashboardStats, 
  Partenaire,
  ProjetRecent
} from '../../services/dashboard.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-projets-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projets-content.html',
  styleUrl: './projets-content.css',
})
export class ProjetsContent implements OnInit, OnDestroy {
  // Données
  projetsTermines: ProjetRecent[] = [];
  stats: DashboardStats | null = null;
  partenaires: Partenaire[] = [];
  
  // États de chargement
  isLoadingStats = true;
  isLoadingPartenaires = true;
  
  // Gestion erreurs
  errorStats: string | null = null;
  errorPartenaires: string | null = null;

  // Carousel
  currentSlide = 0;
  totalSlides = 3;
  carouselInterval?: any;

  // Animation des compteurs
  private counterSubscription?: Subscription;
  animatedCounters = {
    membres: 0,
    annees: 0,
    projets: 0,
    engagement: 0,
    totalDons: 0,
    donateurs: 0,
    projetsFinalises: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadPartenaires();
    this.initCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
  }

  /**
   * Charge les statistiques depuis l'API
   */
  loadStats(): void {
    this.isLoadingStats = true;
    this.errorStats = null;

    this.dashboardService.getHomeStats().subscribe({
      next: (response) => {
        this.stats = response.stats;

        // ✅ Filtrer uniquement les projets terminés pour l'affichage spécifique
        if (this.stats && this.stats.projets && this.stats.projets.recents) {
          this.projetsTermines = this.stats.projets.recents.filter(
            projet => projet.statut === 'termine'
          );
        }

        this.isLoadingStats = false;
        // Déclenche l'animation après un court délai pour le rendu initial
        setTimeout(() => this.animateCounters(), 500);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats:', error);
        this.errorStats = 'Impossible de charger les statistiques.';
        this.isLoadingStats = false;
      }
    });
  }

  /**
   * Charge les partenaires actifs
   */
  loadPartenaires(): void {
    this.isLoadingPartenaires = true;
    this.errorPartenaires = null;

    this.dashboardService.getPartenairesActifs().subscribe({
      next: (response) => {
        this.partenaires = response.partenaires;
        this.isLoadingPartenaires = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
        this.errorPartenaires = 'Impossible de charger les partenaires.';
        this.isLoadingPartenaires = false;
      }
    });
  }

  /**
   * Animation progressive des compteurs
   */
  animateCounters(): void {
    if (!this.stats) return;

    const duration = 2000; // 2 secondes
    const steps = 60; 
    const stepDuration = duration / steps;

    const targets = {
      membres: this.stats.membres?.total || 0,
      annees: 18, // Valeur fixe historique
      projets: this.stats.projets?.total || 0,
      engagement: 100, // Valeur fixe (pourcentage)
      totalDons: this.stats.dons?.total_montant || 0,
      donateurs: this.stats.dons?.nombre_donateurs || 0,
      projetsFinalises: this.stats.dons?.projets_finances || 0
    };

    let currentStep = 0;

    this.counterSubscription = interval(stepDuration).subscribe(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Fonction d'ease-out (cubique)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.animatedCounters = {
        membres: Math.floor(targets.membres * easeProgress),
        annees: Math.floor(targets.annees * easeProgress),
        projets: Math.floor(targets.projets * easeProgress),
        engagement: Math.floor(targets.engagement * easeProgress),
        totalDons: Math.floor(targets.totalDons * easeProgress),
        donateurs: Math.floor(targets.donateurs * easeProgress),
        projetsFinalises: Math.floor(targets.projetsFinalises * easeProgress)
      };

      if (currentStep >= steps) {
        this.animatedCounters = { ...targets };
        this.counterSubscription?.unsubscribe();
      }
    });
  }

  /**
   * Initialise le carousel des témoignages
   */
  initCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  moveToSlide(index: number): void {
    this.currentSlide = index;
  }

  /**
   * Retourne l'URL de l'image (via le service backend)
   */
  getImageUrl(path: string | null): string {
    return this.dashboardService.getImageUrl(path);
  }

  /**
   * Gestion des classes CSS pour les badges
   */
  getProjetBadgeClass(statut: string): string {
    switch (statut) {
      case 'en_cours': return 'project-badge';
      case 'termine': return 'project-badge completed';
      default: return 'project-badge';
    }
  }

  getProjetBadgeText(statut: string): string {
    switch (statut) {
      case 'en_cours': return 'En cours';
      case 'termine': return 'Complété';
      case 'approuve': return 'Approuvé';
      default: return statut.replace('_', ' ');
    }
  }

  /**
   * Utilitaires de formatage
   */
  formatDate(dateString: string): { day: string; month: string } {
    if (!dateString) return { day: '00', month: '...' };
    const date = new Date(dateString);
    const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 
                    'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];
    
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: months[date.getMonth()]
    };
  }

  formatMontant(montant: number): string {
    return (montant || 0).toLocaleString('fr-FR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  }

  retry(): void {
    if (this.errorStats) this.loadStats();
    if (this.errorPartenaires) this.loadPartenaires();
  }
}