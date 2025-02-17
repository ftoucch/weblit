import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filterQuery } from '../../../models/research';
import { ResearchService } from '../../../services/research.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-create-query',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './create-query.component.html',
  styleUrl: './create-query.component.css',
})
export class CreateQueryComponent {
  @Output() queryCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  processLoading: boolean = false;
  form: FormGroup;
  isSpinning = false;
  researchId = '';

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private researchService: ResearchService,
    private activeRoute: ActivatedRoute
  ) {
    this.form = fb.group({
      searchString: ['', Validators.required],
      researchQuestion: ['', Validators.required],
      inclusionCriteria: ['', Validators.required],
      exclusionCriteria: ['', Validators.required],
      startYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      endYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      maxResearch: ['', [Validators.required, Validators.min(1)]]
    });
    this.researchId = this.activeRoute.snapshot.params['id'];
  }

  submitForm(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();

    if (!this.form.valid) {
      this.notification.create(
        'error',
        'Error',
        'Please check fields and try again'
      );
      return;
    }

    let data = new filterQuery();
    data = { ...data, ...this.form.value, systematicReviewId: this.researchId };

    this.isSpinning = true;
    this.researchService.createQuery(data).subscribe({
      next: () => {
        this.notification.create(
          'success',
          'Success',
          'You have successfully created a filter query'
        );
        this.isSpinning = false;
        this.queryCreated.emit(); // Notify parent component 
      },
      error: () => {
        this.isSpinning = false;
        this.notification.create('error', 'Error', 'An error occurred');
      },
    });
  }

  cancelForm(): void {
    this.cancel.emit(); // Notify parent to close form
  }
}
