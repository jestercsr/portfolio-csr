import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Feedback {
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

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = '/api/feedbacks';
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

    return this.http.post<Feedback>(this.apiUrl, feedback, { headers }).pipe(
      tap(newFeedback => {
        const current = this.feedbacksSubject.value;
        this.feedbacksSubject.next([...current, newFeedback]);
      })
    );
  }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl).pipe(
      tap(feedbacks => this.feedbacksSubject.next(feedbacks))
    );
  }

  private loadFeedbacks(): void {
    this.getFeedbacks().subscribe();
  }

  resolveFeedback(feedbackId: string): Observable<Feedback> {
    return this.http.patch<Feedback>(
      `${this.apiUrl}/${feedbackId}`,
      { resolved: true }
    ).pipe(
      tap(updatedFeedback => {
        const current = this.feedbacksSubject.value;
        const index = current.findIndex(f => f.id === feedbackId);
        if (index > -1) {
          current[index] = updatedFeedback;
          this.feedbacksSubject.next([...current]);
        }
      })
    );
  }

  deleteFeedback(feedbackId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${feedbackId}`).pipe(
      tap(() => {
        const current = this.feedbacksSubject.value;
        this.feedbacksSubject.next(current.filter(f => f.id !== feedbackId));
      })
    );
  }
}