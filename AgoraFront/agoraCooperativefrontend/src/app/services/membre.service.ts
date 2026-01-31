import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api';
import { Membre } from '../models/membre.model';

export type UpdateMembrePayload = Partial<Pick<Membre, 'telephone' | 'adresse' | 'ville' | 'code_postal' | 'biographie'>>;

@Injectable({
  providedIn: 'root'
})
export class MembreService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/membres`;
  private readonly adminUrl = `${API_CONFIG.baseUrl}/admin/membres`;

  constructor(private http: HttpClient) {}

  // Routes pour les membres connectés
  getMembre(codeMembre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${codeMembre}`);
  }

  updateMembre(codeMembre: string, payload: UpdateMembrePayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${codeMembre}`, payload);
  }

  // --- Nouvelles méthodes Admin ---

  /**
   * Récupère la liste de tous les membres (Admin uniquement)
   */
  getTousLesMembres(): Observable<any> {
    return this.http.get<any>(this.adminUrl);
  }

  /**
   * Télécharge l'export PDF de la liste des membres
   */
  exporterMembresPDF(): Observable<Blob> {
    return this.http.get(`${this.adminUrl}/export/pdf`, {
      responseType: 'blob'
    });
  }
}