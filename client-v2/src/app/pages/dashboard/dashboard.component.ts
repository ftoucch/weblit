import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Router,
} from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserService } from '../../services/user.service';
import { GeneralService } from '../../services/general.service';
import { Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { CreateReviewComponent } from '../../modals/create-review/create-review.component';
import { ResearchService } from '../../services/research.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NzIconModule,
    CreateReviewComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @ViewChild(CreateReviewComponent, { static: false })
  createModal!: CreateReviewComponent;
  title: string = '';
  isVisible = false;
  researchID = '';
  constructor(
    private userService: UserService,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private researchService: ResearchService
  ) {
    this.getTitle();
    this.location.onUrlChange(() => {
      this.researchService.selectedResearch$.subscribe((research) => {
        if (research) {
          this.title = research.title;
        } else {
          this.getTitle();
        }
      });
    });
  }
  ngOnInit(): void {
    this.refreshToken();
  }

  async getTitle() {
    this.title = (await firstValueFrom(this.route.children[0].data))['title'];
  }

  refreshToken() {
    this.userService.refreshToken().subscribe({
      next: (res: any) => {
        this.generalService.saveUser(res);
      },
    });
  }
  logOut() {
    this.generalService.logOutUser();
  }

  showCreateModal(): void {
    this.createModal.showModal();
  }
}
