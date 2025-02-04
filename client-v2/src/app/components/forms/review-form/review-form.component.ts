import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin'; // Import NzSpinModule
import { systematicReview } from '../../../models/research';
import { ResearchService } from '../../../services/research.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzSpinModule], // Add NzSpinModule
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent {
  @Input() isEditMode: boolean = false; // Determines if the form is in edit mode
  @Input() reviewToEdit: any = null; // The review to edit (if in edit mode)
  @Output() formSubmitted = new EventEmitter<void>(); // Emits when the form is submitted
  @Output() formCanceled = new EventEmitter<void>(); // Emits when the form is canceled

  form: FormGroup;
  processLoading: boolean = false; // Track loading state

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private researchService: ResearchService,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.reviewToEdit) {
      // Populate the form with the review data if in edit mode
      this.form.patchValue({
        title: this.reviewToEdit.title,
        description: this.reviewToEdit.description,
      });
    }
  }

  handleSubmit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.notification.create(
        'error',
        'Error',
        'Please check fields and try again'
      );
      return;
    }

    this.processLoading = true; // Start loading

    const data = new systematicReview();
    const user = this.userService.getUser();
    data.title = this.form.value.title;
    data.description = this.form.value.description;
    data.user = user.id;

    if (this.isEditMode && this.reviewToEdit) {
      // Update existing review
      this.researchService.updateResearch(this.reviewToEdit._id, data).subscribe({
        next: (res: any) => {
          this.notification.create(
            'success',
            'Success',
            'Review updated successfully'
          );
          this.processLoading = false; // Stop loading
          this.formSubmitted.emit();
          this.router.navigateByUrl(`dashboard/research/${res.id}`);
        },
        error: (error: any) => {
          this.notification.create('error', 'Error', 'An error occurred');
          this.processLoading = false; // Stop loading
        },
      });
    } else {
      // Create new review
      this.researchService.createResearch(data).subscribe({
        next: (res: any) => {
          this.notification.create(
            'success',
            'Success',
            'Review created successfully'
          );
          this.processLoading = false; // Stop loading
          this.formSubmitted.emit();
          this.router.navigateByUrl(`dashboard/research/${res.id}`);
        },
        error: (error: any) => {
          this.notification.create('error', 'Error', 'An error occurred');
          this.processLoading = false; // Stop loading
        },
      });
    }
  }

  handleCancel(): void {
    this.formCanceled.emit();
    this.form.reset();
  }
}