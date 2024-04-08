import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { filterQuery, systematicReview } from '../models/research';

@Injectable({
  providedIn: 'root',
})
export class ResearchService {
  private selectedReview = new BehaviorSubject<any>(null);
  public selectedResearch$ = this.selectedReview.asObservable();

  constructor(private apiService: ApiService) {}
  getAllResearch() {
    return this.apiService.get('research/all');
  }
  getResearch(id: string) {
    return this.apiService.get(`research/${id}`);
  }

  setSelectedResearch(research: any): void {
    this.selectedReview.next(research);
  }

  clearSelectedResearch(): void {
    this.selectedReview.next(null);
  }
  createResearch(data: systematicReview) {
    return this.apiService.post('research/create', data);
  }
  deleteResearch(id: string) {
    return this.apiService.delete(`research/${id}`);
  }
  updateResearch(id: string, data: systematicReview) {
    return this.apiService.update(`research/${id}`, data);
  }

  createQuery(data: filterQuery) {
    return this.apiService.post('research/query/create', data);
  }
  getAllQuery(id: string) {
    return this.apiService.get(`research/query/all/${id}`);
  }
  deleteQuery(id: string) {
    return this.apiService.delete(`research/query/${id}`);
  }
  getAllPrimaryStudies(id: string) {
    return this.apiService.get(`research/primarystudies/${id}`);
  }
}
