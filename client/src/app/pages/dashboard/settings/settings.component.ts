import { Component } from '@angular/core';
import { ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  constructor(private researchService: ResearchService) {
    this.researchService.clearSelectedResearch();
  }
}
