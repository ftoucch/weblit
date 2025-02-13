import { Component } from '@angular/core';
import { ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  constructor(private researchService: ResearchService) {
    this.researchService.clearSelectedResearch();
  }
}
