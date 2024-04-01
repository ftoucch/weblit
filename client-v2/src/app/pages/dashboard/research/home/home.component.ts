import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditComponent } from '../../../../modals/edit/edit.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

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
  researchs: Array<any> = [];
  constructor(private researchService: ResearchService, private modal: NzModalService) {
    this.getAllResearch();
  }

  selectResearchForEdit(research: any): void {
    this.researchService.setSelectedResearch(research);
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
 
  showDeleteConfirm(researchID: any): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => console.log(researchID),
      nzCancelText: 'Cancel',
    });
  }
}
