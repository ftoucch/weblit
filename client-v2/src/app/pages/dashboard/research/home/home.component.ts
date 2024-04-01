import { Component } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  researchs: Array<any> = [];
  constructor(private researchService: ResearchService) {
    this.getAllResearch();
  }

  getAllResearch() {
    this.researchService.getAllResearch().subscribe({
      next: (res: any) => {
        this.researchs = res.data;
      },
    });
  }
}
