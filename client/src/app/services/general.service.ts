import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor() {}

  saveUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  getToken() {
    const userItem = sessionStorage.getItem('user');
    if (!userItem) {
      return '';
    }

    try {
      const user = JSON.parse(userItem);
      return user.token || '';
    } catch (error) {
      console.error('Error parsing user data from sessionStorage:', error);
      return '';
    }
  }

  logOutUser() {
    sessionStorage.clear();
    window.location.replace('/signin');
    console.log('out');
  }
}
