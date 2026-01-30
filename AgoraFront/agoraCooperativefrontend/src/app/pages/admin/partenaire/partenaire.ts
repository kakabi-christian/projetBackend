import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartenaireService } from '../../../services/partenaire.service';
import { AuthService } from '../../../services/auth.service';
import { Partenaire } from '../../../models/partenaire.model';
import { API_CONFIG } from '../../../services/api'; // Import centralisé

@Component({
  selector: 'app-partenaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partenaire.html',
  styleUrl: './partenaire.css',
})
export class Partners implements OnInit {
  public readonly API_CONFIG = API_CONFIG; // On rend API_CONFIG accessible au HTML
  partenaires: Partenaire[] = [];
  paginationMeta: any = null;
  loading: boolean = true;
  userRole: string = 'membre';

  // États UI
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  
  // Variable pour le filtrage
  currentStatut: string = ''; 

  // Objet de formulaire
  currentPartenaire: any = this.initPartenaire();

  constructor(
    private partenaireService: PartenaireService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.extractUserRole();
    this.chargerPartenaires();
  }

  /**
   * Diagnostic des erreurs d'images pour les logos partenaires
   */
  handleImageError(event: any, partenaire: Partenaire) {
    const imgElement = event.target as HTMLImageElement;
    const defaultImg = 'assets/default-partner.jpg'; // Assure-toi d'avoir cette image en local

    if (imgElement.src.includes(defaultImg)) return;

    console.group(`Erreur Logo Partenaire : ${partenaire.nom}`);
    console.warn(`URL échouée : ${imgElement.src}`);
    console.log(`Base URL utilisée : ${this.API_CONFIG.storageUrl}`);
    console.groupEnd();

    imgElement.src = defaultImg;
  }

  extractUserRole() {
    this.userRole = this.authService.getUserRole();
    console.log('Rôle détecté dans le composant Partenaire :', this.userRole);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  initPartenaire() {
    return {
      nom: '',
      type: 'sponsor',
      description: '',
      site_web: '',
      contact_nom: '',
      contact_email: '',
      contact_telephone: '',
      niveau_partenariat: 'principal',
      est_actif: true,
      ordre_affichage: 1
    };
  }

  chargerPartenaires(page: number = 1) {
    this.loading = true;
    this.partenaireService.getPartenaires(page).subscribe({
      next: (res) => {
        // Extraction sécurisée des données
        let data = res.partenaires?.data || [];
        
        if (this.currentStatut) {
          data = data.filter(
            (p: any) => p.niveau_partenariat === this.currentStatut
          );
        }
        
        this.partenaires = data;
        this.paginationMeta = res.partenaires;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement partenaires:', err);
        this.loading = false;
      }
    });
  }

  ouvrirModal(partenaire?: Partenaire) {
    this.selectedFile = null;
    if (partenaire) {
      this.isEditMode = true;
      this.currentPartenaire = { ...partenaire };
    } else {
      this.isEditMode = false;
      this.currentPartenaire = this.initPartenaire();
    }
    this.showModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  enregistrer() {
    const formData = new FormData();
    
    Object.keys(this.currentPartenaire).forEach(key => {
      const value = this.currentPartenaire[key];
      
      if (key === 'est_actif') {
        formData.append('est_actif', value ? '1' : '0');
      } 
      // On n'envoie pas les URLs de la DB ni les champs vides
      else if (value !== null && value !== undefined && value !== '' && key !== 'logo_url' && key !== 'code_partenaire') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    const action = this.isEditMode 
      ? this.partenaireService.updatePartenaire(this.currentPartenaire.code_partenaire, formData)
      : this.partenaireService.createPartenaire(formData);

    action.subscribe({
      next: () => {
        this.showModal = false;
        this.chargerPartenaires(this.paginationMeta?.current_page || 1);
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement', err);
        if (err.status === 422) {
           alert('Erreur de validation: ' + JSON.stringify(err.error.errors));
        } else {
           alert('Une erreur est survenue lors de l\'enregistrement.');
        }
      }
    });
  }

  supprimer(code: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      this.partenaireService.deletePartenaire(code).subscribe({
        next: () => {
          this.chargerPartenaires(this.paginationMeta?.current_page || 1);
        },
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }

  allerAPage(page: number) {
    if (this.paginationMeta && page >= 1 && page <= this.paginationMeta.last_page) {
      this.chargerPartenaires(page);
    }
  }
}