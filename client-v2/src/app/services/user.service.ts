import { Signin, Signup } from '../models/auth';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}
  signIn(data: Signin) {
    return this.apiService.post('auth/login', data);
  }
  signUp(data: Signup) {
    return this.apiService.post('auth/register', data);
  }

  refreshToken() {
    return this.apiService.get('users/me');
  }
  getUser() {
    let res: any = sessionStorage.getItem('user') ?? undefined;

    if (!res || res == '') {
      return '';
    }

    return JSON.parse(res).id;
  }
}
