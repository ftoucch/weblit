import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { EmptyComponent } from '../../../../components/empty/empty.component';
import { ChatboxComponent } from '../../../../components/chatbox/chatbox.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { CreateQueryComponent } from '../../../../components/forms/create-query/create-query.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    NzSwitchModule,
    NzSkeletonModule,
    FormsModule,
    EmptyComponent,
    ChatboxComponent,
    CreateQueryComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @ViewChild(ChatboxComponent, { static: false })
  openChatBox!: ChatboxComponent;
  
  research: any;
  researchId: string = '';
  filterQueries: Array<any> = [];
  primaryStudies: Array<any> = [];
  showUnfilteredPapers = false;
  loading = false;
  expandedQueries: { [key: number]: boolean } = {};
  expandedAbstracts: { [key: number]: boolean } = {};

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
    this.loading = true;
    this.researchService.getResearch(this.researchId).subscribe({
      next: (res: any) => {
        this.research = res;
        this.loading = false;
        if (res.length === 0) {
          this.notification.create('info', 'No Research Found', 'No research matches your criteria.');
        }
      },
      error: () => (this.loading = false),
    });
  }

  getAllQuery() {
    this.researchService.getAllQuery(this.researchId).subscribe({
      next: (res: any) => {
        this.filterQueries = res.data || [];
      },
    });
  }

  deleteQuery(queryID: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this Query?',
      nzContent: 'Deleting this query will also remove all associated research papers.',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => {
        this.researchService.deleteQuery(queryID).subscribe({
          next: () => {
            this.notification.create('success', 'Success', 'Query successfully deleted.');
            this.getAllQuery();
            this.getAllPrimaryStudies();
          },
        });
      },
    });
  }

  getAllPrimaryStudies() {
    this.loading = true;
    this.researchService.getAllPrimaryStudies(this.researchId).subscribe({
      next: (res: any) => {
        this.primaryStudies = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getUnfilteredPaper() {
    this.loading = true;
    this.researchService.getUnfilteredPapers(this.researchId).subscribe({
      next: (res: any) => {
        this.primaryStudies = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  showChatBox() {
    this.openChatBox.open();
  }

  onSwitchChange(switchState: boolean): void {
    switchState ? this.getUnfilteredPaper() : this.getAllPrimaryStudies();
  }

  toggleAbstract(index: number) {
    this.expandedAbstracts[index] = !this.expandedAbstracts[index];
  }

  truncateText(text: string, index: number): string {
    if (!text) return 'Abstract not available';
    if (this.expandedAbstracts[index]) return text;
    const words = text.split(' ');
    return words.length > 20 ? words.slice(0, 20).join(' ') + '...' : text;
  }

  toggleQueryDetails(index: number): void {
    this.expandedQueries[index] = !this.expandedQueries[index];
  }
}
