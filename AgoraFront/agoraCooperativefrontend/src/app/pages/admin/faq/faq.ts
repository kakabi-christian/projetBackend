import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MembreService } from '../../../services/membre.service';
import { Membre } from '../../../models/membre.model';

@Component({
  selector: 'app-membre-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.html', // Gardé selon ton arborescence actuelle
  styleUrl: './faq.css',     // Gardé selon ton arborescence actuelle
})
export class MembreAdmin implements OnInit {
  membres: Membre[] = [];
  loading = false;
  exporting = false;
  searchTerm = '';

  constructor(
    private membreService: MembreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerMembres();
  }

  chargerMembres(): void {
    this.loading = true;
    this.membreService.getTousLesMembres().subscribe({
      next: (response) => {
        this.membres = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement membres', err);
        this.loading = false;
      }
    });
  }

  exporterEnPDF(): void {
    this.exporting = true;
    this.membreService.exporterMembresPDF().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.download = `liste_membres_agora_${date}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.exporting = false;
      },
      error: (err) => {
        console.error('Erreur export PDF', err);
        this.exporting = false;
      }
    });
  }

  // CORRECTION : Suppression de l'accent pour éviter le Parser Error
  get membresFiltres(): Membre[] {
    if (!this.searchTerm) return this.membres;
    const term = this.searchTerm.toLowerCase();
    return this.membres.filter(m => 
      m.nom.toLowerCase().includes(term) || 
      m.prenom.toLowerCase().includes(term) || 
      m.code_membre.toLowerCase().includes(term)
    );
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}