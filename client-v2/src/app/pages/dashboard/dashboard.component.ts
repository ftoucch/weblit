import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserService } from '../../services/user.service';
import { GeneralService } from '../../services/general.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NzIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private generalService: GeneralService
  ) {}
  ngOnInit(): void {
    this.refreshToken();
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
}
