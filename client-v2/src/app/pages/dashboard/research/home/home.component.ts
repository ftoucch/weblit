import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditComponent } from '../../../../modals/edit/edit.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Research } from '../../../../models/research';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NzIconModule, EditComponent, NzModalModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild(EditComponent, { static: false }) editModal!: EditComponent;
  isVisible = false
  selectedResearch: Research | null = null

  researchs: Array<any> = [];
  constructor(private researchService: ResearchService) {
    this.getAllResearch();
  }

  selectResearchForEdit(research: any): void {
    this.selectedResearch = research;
    console.log(this.selectedResearch)
    this.showEditModal();
  }

  showEditModal(): void {
    this.editModal.showModal();
  }
  getAllResearch() {
    this.researchService.getAllResearch().subscribe({
      next: (res: any) => {
        this.researchs = res.data;
      },
    });
  }
}
