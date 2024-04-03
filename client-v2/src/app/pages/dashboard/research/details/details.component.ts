import { Component } from '@angular/core';
import { ResearchService } from '../../../../services/research.service';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  research: any;
  researchId: string = ' ';
  constructor (private route: ActivatedRoute, private researchService: ResearchService) {
    this.researchId = this.route.snapshot.params['id']
    this.getResearch();
 }
 getResearch() {
  this.researchService.getResearch(this.researchId).subscribe({
    next : (res: any) => {
      this.research = res ;
    }
  })
 }
}
