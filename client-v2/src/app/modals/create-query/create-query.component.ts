import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create-query',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NzModalModule],
  templateUrl: './create-query.component.html',
  styleUrl: './create-query.component.css',
})
export class CreateQueryComponent {
  processLoading: boolean = false;
  form: FormGroup;
  isVisible = false;
  researchID = '';
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.form = fb.group({
      searchString: ['', Validators.required],
      researchQuestion: ['', Validators.required],
      inclusionCriteria: ['', Validators.required],
      exclusionCriteria: ['', Validators.required],
      systematicReviewId: ['', Validators.required],
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (!this.form.valid) {
      this.notification.create(
        'error',
        'error',
        'please check fields and try again'
      );
      return;
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
