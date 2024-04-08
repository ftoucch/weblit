import { Component } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  standalone: true,
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  imports: [NzDrawerModule],
})
export class ChatboxComponent {
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
