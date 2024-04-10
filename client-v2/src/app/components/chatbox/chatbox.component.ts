import { Component, Input } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  imports: [NzDrawerModule, NzIconModule],
})
export class ChatboxComponent {
  @Input() research: any;
  researchId: string = '';
  researchTitle: string = '';
  visible = false;
constructor() {}
  open(): void {
    this.visible = true;
    this.researchTitle =  this.research.title
  }

  close(): void {
    this.visible = false;
  }
}
