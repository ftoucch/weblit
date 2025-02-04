import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../services/research.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmptyComponent } from '../../../components/empty/empty.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ReviewFormComponent } from '../../../components/forms/review-form/review-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    NzModalModule,
    EmptyComponent,
    NzDropDownModule,
    NzSkeletonModule,
    ReviewFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  researchs: Array<any> = [];
  researchID = '';
  loading = true;
  showCreateForm = false;
  editingResearch: any = null;

  constructor(
    private researchService: ResearchService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.getAllResearch();
    this.researchService.clearSelectedResearch();
  }

  // Fetch all research data
  getAllResearch() {
    this.loading = true;
    this.researchService.getAllResearch().subscribe({
      next: (res: any) => {
        this.researchs = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Select a research for editing
  selectResearchForEdit(research: any): void {
    this.editingResearch = research;
  }

  // Select a research for viewing
  selectResearch(research: any): void {
    this.researchService.setSelectedResearch(research);
  }

  // Show delete confirmation modal
  showDeleteConfirm(researchID: any): void {
    this.researchID = researchID;
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this review?',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => {
        this.researchService.deleteResearch(this.researchID).subscribe({
          next: () => {
            this.notification.create('success', 'Success', 'Review was successfully deleted');
            this.getAllResearch();
          },
        });
      },
      nzCancelText: 'Cancel',
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.editingResearch = null;
  }

  toggleEditForm(research: any): void {
    this.editingResearch = this.editingResearch === research ? null : research;
    this.showCreateForm = false; 
  }

  handleFormSubmitted(): void {
    this.getAllResearch();
    this.showCreateForm = false;
    this.editingResearch = null;
  }
}