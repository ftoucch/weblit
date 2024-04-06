import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CreateQueryComponent } from '../../../../modals/create-query/create-query.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzInputModule, CreateQueryComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @ViewChild(CreateQueryComponent, { static: false })
  createReviewModal!: CreateQueryComponent;
  research: any;
  researchId: string = ' ';
  filterQueries: Array<any> = [];
  primaryStudies: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    private researchService: ResearchService
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
      },
    });
  }

  getAllQuery() {
    this.researchService.getAllQuery(this.researchId).subscribe({
      next: (res: any) => {
        this.filterQueries = res.data;
      },
    });
  }
  getAllPrimaryStudies() {
    this.researchService.getAllPrimaryStudies(this.researchId).subscribe({
      next: (res: any) => {
        this.primaryStudies = res.data;
        console.log(this.primaryStudies);
      },
    });
  }
  showCreateQueryModal() {
    this.createReviewModal.showModal();
  }
}
