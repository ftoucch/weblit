import { Component, ViewChild } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateQueryComponent } from '../../../../modals/create-query/create-query.component';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NzIconModule, NzInputModule, CreateQueryComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @ViewChild(CreateQueryComponent, { static: false })
  createReviewModal!: CreateQueryComponent;
  research: any;
  researchId: string = ' ';
  constructor(
    private route: ActivatedRoute,
    private researchService: ResearchService
  ) {
    this.researchId = this.route.snapshot.params['id'];
    this.getResearch();
  }
  getResearch() {
    this.researchService.getResearch(this.researchId).subscribe({
      next: (res: any) => {
        this.research = res;
      },
    });
  }

  showCreateQueryModal() {
    this.createReviewModal.showModal();
  }
}
