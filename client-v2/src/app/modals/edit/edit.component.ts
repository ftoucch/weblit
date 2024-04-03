import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ResearchService } from '../../services/research.service';
import { systematicReview } from '../../models/research';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NzModalModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  processLoading: boolean = false;
  form: FormGroup;
  isVisible = false;
  researchID = ''
  constructor( private fb: FormBuilder, private researchService : ResearchService, private notification : NzNotificationService, private userService: UserService, private router: Router){
    this.form = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.researchService.selectedResearch$.subscribe((research) => {
      if (research) {
        this.researchID = research._id
        this.form.patchValue({
          title: research.title,
          description: research.description,
        });
      }
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
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
    let data = new systematicReview();
    const userID = this.userService.getUser()
    data = { ...data, ...this.form.value, "user":userID };
    this.researchService.updateResearch(this.researchID, data).subscribe({
      next: (res:any) => {
        this.notification.create(
          'success',
          'Success',
          'Systematic Review was successfully Edited'
        );
        this.isVisible = false;
        this.router.navigateByUrl(`dashboard/research/${res.id}`);
      },
      error: (error: any) => {
        this.notification.create('error', 'error', 'an error occured');
      },
    })
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
