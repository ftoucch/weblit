import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditComponent } from '../../../../modals/edit/edit.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    EditComponent,
    NzModalModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild(EditComponent, { static: false }) editModal!: EditComponent;
  isVisible = false;
  researchs: Array<any> = [];
  researchID = '';
  constructor(
    private researchService: ResearchService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.getAllResearch();
  }

  selectResearchForEdit(research: any): void {
    this.researchService.setSelectedResearch(research);
    this.showEditModal();
  }

  selectResearch(research: any): void {
    this.researchService.setSelectedResearch(research);
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

  showDeleteConfirm(researchID: any): void {
    this.researchID = researchID;
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this review ?',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => {
        this.researchService.deleteResearch(this.researchID).subscribe({
          next: (res: any) => {
            this.notification.create(
              'success',
              'Success',
              'Review was successfully deleted'
            );
            this.getAllResearch();
          },
        });
      },
      nzCancelText: 'Cancel',
    });
  }
}
