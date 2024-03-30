import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {customFetch} from '../utils/customFetch.js'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { 

  }
  get url() {
    return customFetch.baseURL;
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + endpoint, body, reqOpts);
  }
}
