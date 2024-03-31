import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Signup } from '../../models/auth';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  processLoading: boolean = false;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private notification: NzNotificationService,
    private generalService: GeneralService
  ) {
    this.form = fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  signup() {
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

    this.processLoading = true;
    let data = new Signup();
    data = { ...data, ...this.form.value };
    this.userService.signUp(data).subscribe({
      next: (res: any) => {
        this.processLoading = false;
        this.generalService.saveUser(res);
        this.notification.create(
          'success',
          'Success',
          'Registeration Successfull sign in to continue'
        );
        this.router.navigateByUrl('/signin');
      },
      error: (error: any) => {
        this.processLoading = false;
        this.notification.create('error', 'error', 'an error occured');
      },
    });
  }
}
