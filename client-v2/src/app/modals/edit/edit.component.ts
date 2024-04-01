import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ResearchService } from '../../services/research.service';
import { systematicReview } from '../../models/research';

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
  constructor( private fb: FormBuilder, private researchService : ResearchService){
    this.form = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.researchService.selectedResearch$.subscribe((research) => {
      if (research) {
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
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
