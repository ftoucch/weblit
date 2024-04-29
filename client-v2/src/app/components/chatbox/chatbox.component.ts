import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  standalone: true,
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  imports: [NzDrawerModule, NzIconModule, RouterLink, ReactiveFormsModule],
})
export class ChatboxComponent {
  processLoading: boolean = false;
  form: FormGroup
  @Input() research: any;
  researchId: string = '';
  researchTitle: string = '';
  visible = false;
constructor(
  private fb: FormBuilder,
  private userService: UserService,
  private chatService : ChatService,
  private notification : NzNotificationService,
  private route : ActivatedRoute
) {
  this.form = fb.group({
    userQuestion: ['', [Validators.required]],
  })
}
  open(): void {
    this.visible = true;
    this.researchTitle =  this.research.title
  }

  close(): void {
    this.visible = false;
  }
  startChat() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if(!this.form.valid) {
      this.notification.create(
        'error',
        'error',
        'please enter message'
      );
      return;
    }
    this.processLoading = true
    let data: any;
    const id = this.route.snapshot.params['id']
    data = { ...data, ...this.form.value}
   this.chatService.startChat(data, id).subscribe({
    next: (res:any) => {
      this.processLoading = false
      console.log(this.form.value)
    }
   })
  }
}
