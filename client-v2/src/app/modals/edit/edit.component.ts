import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NzModalModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  @Input() researchTitle: string | null = null;
  @Input() researchDescription: string | null = null;
  @Input() researchId: string | null = null;
  
  processLoading: boolean = false;
  form: FormGroup;
  isVisible = false;
  research: any;
  constructor( private fb: FormBuilder){
    this.form = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
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
