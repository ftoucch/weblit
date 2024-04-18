import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateQueryComponent } from '../../../../modals/create-query/create-query.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmptyComponent } from '../../../../components/empty/empty.component';
import { ChatboxComponent } from '../../../../components/chatbox/chatbox.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    CreateQueryComponent,
    EmptyComponent,
    ChatboxComponent,
    NzSwitchModule,
    FormsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @ViewChild(CreateQueryComponent, { static: false })
  createQueryModal!: CreateQueryComponent;
  @ViewChild(ChatboxComponent, { static: false })
  openChatBox!: ChatboxComponent;
  emptyModal!: EmptyComponent;
  research: any;
  researchId: string = ' ';
  filterQueries: Array<any> = [];
  primaryStudies: Array<any> = [];
  showUnfilteredPapers = false;
  constructor(
    private route: ActivatedRoute,
    private researchService: ResearchService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {
    this.researchId = this.route.snapshot.params['id'];
    this.getResearch();
    this.getAllQuery();
    this.getAllPrimaryStudies();
  }
  getResearch() {
    this.researchService.getResearch(this.researchId).subscribe({
      next: (res: any) => {
        this.research = res;
        if(res.length == 0) {
          this.notification.create(
            'Sorry',
            'Sorry',
            'there are no reseearch matching your criteria'
          );
        }
      },
    });
  }
  getAllQuery() {
    this.researchService.getAllQuery(this.researchId).subscribe({
      next: (res: any) => {
        if(res.data)
        this.filterQueries = res.data;
      },
    });
  }
  deleteQuery(queryID: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this Query ?',
      nzContent:
        'Dleteing this query will also remove all associated research papers',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => {
        this.researchService.deleteQuery(queryID).subscribe({
          next: (res: any) => {
            this.notification.create(
              'success',
              'Success',
              'Query was successfully deleted'
            );
            this.getAllQuery();
            this.getAllPrimaryStudies();
          },
        });
      },
    });
  }
  getAllPrimaryStudies() {
    this.researchService.getAllPrimaryStudies(this.researchId).subscribe({
      next: (res: any) => {
        this.primaryStudies = res.data;
      },
    });
  }

  getUnfilteredPaper() {
    this.researchService.getUnfilteredPapers(this.researchId).subscribe({
      next: (res: any) => {
        this.primaryStudies = res.data
      }
    })
  }
  showCreateQueryModal() {
    this.createQueryModal.showModal();
  }
  showChatBox() {
    this.openChatBox.open();
  }

  onSwitchChange(switchState: boolean): void {
    if (switchState) {
      this.getUnfilteredPaper();
    }
    else {
      this.getAllPrimaryStudies();
    }
  }

}
