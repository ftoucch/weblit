import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ResearchService {
  constructor(private apiService: ApiService) {}
  getAllResearch() {
    return this.apiService.get('research/all');
  }
}
