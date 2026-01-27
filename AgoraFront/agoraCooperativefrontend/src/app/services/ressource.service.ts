import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/ressources`;

  constructor(private http: HttpClient) {}

  getRessources(filters?: { categorie?: string; type?: string; search?: string }): Observable<any> {
    let params = new HttpParams();

    if (filters?.categorie) params = params.set('categorie', filters.categorie);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<any>(this.apiUrl, { params });
  }

  downloadRessource(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      observe: 'response',
      responseType: 'blob'
    });
  }
}
