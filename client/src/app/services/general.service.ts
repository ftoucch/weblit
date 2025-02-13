import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor() {}

  saveUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  getToken() {
    let res: any = sessionStorage.getItem('user') ?? undefined;

    if (!res || res == '') {
      return '';
    }

    return JSON.parse(res).token;
  }

  logOutUser() {
    sessionStorage.clear();
    window.location.replace('/signin');
    console.log('out');
  }
}
