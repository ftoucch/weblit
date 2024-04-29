import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  imports: [NzDrawerModule, NzIconModule, RouterLink, ReactiveFormsModule, NzSpinModule, CommonModule],
})
export class ChatboxComponent {
  processLoading: boolean = false;
  form: FormGroup
  chatHistory: {role: string, message: string}[] = [];
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
    const userQuestion = this.form.value.userQuestion;
    this.chatHistory.push({ role: 'user', message: userQuestion });
    let data: any;
    const id = this.route.snapshot.params['id']
    data = { ...data, ...this.form.value}
    this.form.reset()
   this.chatService.startChat(data, id).subscribe({
    next: (res:any) => {
      this.chatHistory.push({ role: 'assistant', message: res.assistant });
      this.processLoading = false
    }
   })
  }
}
