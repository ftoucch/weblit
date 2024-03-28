import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {  
  form: FormGroup;
  constructor(private fb: FormBuilder) {
  this.form = fb.group({
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  })
  }

  signin() {
    console.log(this.form.value)
  }
}
