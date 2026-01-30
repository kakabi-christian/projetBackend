import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetService } from '../../../services/projet.service';
import { Projet } from '../../../models/projet.model';
import { API_CONFIG } from '../../../services/api';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements OnInit {
  public readonly API_CONFIG = API_CONFIG;
  projets: Projet[] = [];
  paginationMeta: any = null;
  loading: boolean = true;

  currentStatut: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  nouvelObjectif: string = '';

  currentProjet: any = this.initProjet();

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.chargerProjets();
  }

  initProjet() {
    return {
      nom: '',
      description: '',
      type: 'agricole',
      statut: 'propose',
      date_debut: '',
      date_fin_prevue: '',
      budget_estime: null,
      coordinateur: '',
      objectifs: [],
      est_public: true
    };
  }

  /**
   * Gestionnaire d'erreur pour les images.
   * Si l'image cloud échoue, on bascule sur l'image locale par défaut.
   */
  handleImageError(event: any, projet: Projet) {
    const imgElement = event.target as HTMLImageElement;
    const defaultImg = 'assets/default-project.jpg';

    // Empêche une boucle infinie si l'image par défaut est elle aussi manquante
    if (imgElement.src.includes(defaultImg)) {
      return;
    }

    console.group(`Diagnostic Image : ${projet.nom}`);
    console.warn(`URL échouée : ${imgElement.src}`);
    console.log(`Valeur DB : ${projet.image_url}`);
    console.log(`Base URL : ${this.API_CONFIG.storageUrl}`);
    console.groupEnd();

    imgElement.src = defaultImg;
  }

  chargerProjets(page: number = 1) {
    this.loading = true;
    this.projetService.getProjets(page).subscribe({
      next: (res) => {
        // Extraction sécurisée des données selon la structure de pagination Laravel
        let data = res.projets?.data || [];
        
        if (this.currentStatut) {
          data = data.filter((p: Projet) => p.statut === this.currentStatut);
        }
        
        this.projets = data;
        this.paginationMeta = res.projets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement projets:', err);
        this.loading = false;
      }
    });
  }

  filtrerProjets(statut: string) {
    this.currentStatut = statut;
    this.chargerProjets(1);
  }

  ouvrirModal(projet?: Projet) {
    this.selectedFile = null;
    this.nouvelObjectif = '';

    if (projet) {
      this.isEditMode = true;
      this.currentProjet = {
        ...projet,
        objectifs: Array.isArray(projet.objectifs) ? [...projet.objectifs] : []
      };
    } else {
      this.isEditMode = false;
      this.currentProjet = this.initProjet();
    }
    this.showModal = true;
  }

  ajouterObjectif() {
    if (this.nouvelObjectif.trim()) {
      this.currentProjet.objectifs.push(this.nouvelObjectif.trim());
      this.nouvelObjectif = '';
    }
  }

  retirerObjectif(index: number) {
    this.currentProjet.objectifs.splice(index, 1);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  enregistrerProjet() {
    const formData = new FormData();

    Object.keys(this.currentProjet).forEach(key => {
      const value = this.currentProjet[key];
      
      if (key === 'objectifs' && Array.isArray(value)) {
        value.forEach((item: string) => formData.append('objectifs[]', item));
      }
      else if (key === 'est_public') {
        formData.append('est_public', value ? '1' : '0');
      }
      else if (value !== null && value !== undefined && value !== '' && key !== 'image_url') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('image_url', this.selectedFile);
    }

    const action = this.isEditMode
      ? this.projetService.updateProjet(this.currentProjet.id, formData)
      : this.projetService.createProjet(formData);

    action.subscribe({
      next: () => {
        this.showModal = false;
        this.chargerProjets(this.paginationMeta?.current_page || 1);
        this.selectedFile = null;
      },
      error: (err) => {
        if (err.status === 422) {
          alert('Erreur de validation : ' + Object.values(err.error.errors).flat().join('\n'));
        } else {
          console.error('Erreur lors de l\'enregistrement:', err);
        }
      }
    });
  }

  supprimer(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe({
        next: () => this.chargerProjets(this.paginationMeta?.current_page || 1),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  allerAPage(page: number) {
    if (this.paginationMeta && page >= 1 && page <= this.paginationMeta.last_page) {
      this.chargerProjets(page);
    }
  }
}