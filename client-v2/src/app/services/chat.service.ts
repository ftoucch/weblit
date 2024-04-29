import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private apiService: ApiService) { 
  }

  startChat(data:any, id: String) {
    return this.apiService.post(`chat/${id}`, data);
  }
  addMessage(data:any, id: String) {
    return this.apiService.update(`chat/${id}`, data);
  }
  getChataHistory(id:String) {
    return this.apiService.get(`chat/${id}`)
  }
}
