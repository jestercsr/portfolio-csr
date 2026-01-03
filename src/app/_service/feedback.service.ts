import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Feedback {
  _id?: string;
  id?: string;
  type: 'bug' | 'suggestion' | 'compliment';
  title: string;
  message: string;
  email?: string;
  rating?: number;
  pageUrl: string;
  timestamp?: Date;
  screenshot?: string;
  resolved?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/api/feedbacks`;
  
  private feedbacksSubject = new BehaviorSubject<Feedback[]>([]);
  public feedbacks$ = this.feedbacksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFeedbacks();
  }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    feedback.pageUrl = window.location.href;
    feedback.timestamp = new Date();
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse<Feedback>>(this.apiUrl, feedback, { headers }).pipe(
      map(response => response.data),
      tap(newFeedback => {
        const current = this.feedbacksSubject.value;
        this.feedbacksSubject.next([...current, newFeedback]);
      })
    );
  }

  getFeedbacks(): Observable<Feedback[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<Feedback[]>>(this.apiUrl, { headers }).pipe(
      map(response => {
        return response.data.map((f: any) => ({
          ...f,
          id: f._id || f.id
        }));
      }),
      tap(feedbacks => {
        this.feedbacksSubject.next(feedbacks);
      })
    );
  }

  private loadFeedbacks(): void {
    this.getFeedbacks().subscribe({
      next: () => {
        console.log('Feedbacks chargés');
      },
      error: () => {
        console.log('Non authentifié - feedbacks non disponibles');
      }
    });
  }

  resolveFeedback(feedbackId: string): Observable<Feedback> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<ApiResponse<Feedback>>(
      `${this.apiUrl}/${feedbackId}`,
      { resolved: true },
      { headers }
    ).pipe(
      map(response => response.data),
      tap(updatedFeedback => {
        const current = this.feedbacksSubject.value;
        const index = current.findIndex(f => (f.id || f._id) === feedbackId);
        if (index > -1) {
          current[index] = updatedFeedback;
          this.feedbacksSubject.next([...current]);
        }
      })
    );
  }

  deleteFeedback(feedbackId: string): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(
      `${this.apiUrl}/${feedbackId}`,
      { headers }
    ).pipe(
      tap(() => {
        const current = this.feedbacksSubject.value;
        this.feedbacksSubject.next(current.filter(f => (f.id || f._id) !== feedbackId));
      })
    );
  }

  getStats(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { headers }).pipe(
      map(response => response.data)
    );
  }
}