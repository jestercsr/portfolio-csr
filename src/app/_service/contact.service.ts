import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/api/contact`;

  constructor(private http: HttpClient) {}

  sendMessage(data: {
    name: string;
    email: string;
    message: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  sendMessageViaML(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/ml`, data);
  }
}