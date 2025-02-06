import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
    RouterLink,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './create-query.component.html',
  styleUrl: './create-query.component.css',
})
export class CreateQueryComponent {
  processLoading: boolean = false;
  form: FormGroup;
  isVisible = false;
  isSpinning = false;
  researchId = '';
  filterQuery: Array<any> = [];

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
      startYear: ['', Validators.required],
      endYear: ['', Validators.required],
      maxResearch: ['', Validators.required],
    });

    this.researchId = this.activeRoute.snapshot.params['id'];
  }

  /** Handles form submission */
  onSubmit(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();

    if (!this.form.valid) {
      this.notification.create('error', 'Error', 'Please check fields and try again');
      return;
    }

    let data = new filterQuery();
    data = { ...data, ...this.form.value, systematicReviewId: this.researchId };

    this.isSpinning = true;

    this.researchService.createQuery(data).subscribe({
      next: () => {
        this.notification.create('success', 'Success', 'You have successfully created a filter query');
        this.isVisible = false;
        this.getAllQuery();
        this.form.reset(); // Reset the form after submission
        window.location.reload();
      },
      error: () => {
        this.isSpinning = false;
        this.notification.create('error', 'Error', 'An error occurred');
      },
    });
  }

  /** Resets the form when the cancel button is clicked */
  onCancel(): void {
    this.form.reset();
  }

  /** Fetches all queries */
  getAllQuery() {
    this.researchService.getAllQuery(this.researchId).subscribe({
      next: (res: any) => {
        this.filterQuery = res.data;
        console.log(this.filterQuery);
      },
    });
  }
}
