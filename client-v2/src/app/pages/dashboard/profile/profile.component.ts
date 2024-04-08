import { Component } from '@angular/core';
import { ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(private researchService: ResearchService) {
    this.researchService.clearSelectedResearch();
  }
}
