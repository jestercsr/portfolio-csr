import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    expiresAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  private sessionSubject = new BehaviorSubject<AuthSession | null>(null);
  private loadingSubject = new BehaviorSubject(true);

  public user$ = this.userSubject.asObservable();
  public session$ = this.sessionSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeSession();
  }

  private initializeSession(): void {
    const token = this.getToken();
    const storedUser = this.getStoredUser();

    if (token && storedUser) {
      this.userSubject.next(storedUser);
      this.loadingSubject.next(false);

      this.getSession().subscribe({
        next: () => {
          console.log('Session validée');
        },
        error: () => {
          this.clearToken();
          this.loadingSubject.next(false);
        }
      });
    } else {
      this.loadingSubject.next(false);
    }
  }

  // S'enregistrer
  signup(request: SignupRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.apiUrl}/sign-up`, request)
      .pipe(
        tap(session => {
          this.storeSession(session);
          this.sessionSubject.next(session);
          this.userSubject.next(session.user);
        }),
        catchError(error => {
          const message = error.error?.message || error.error?.error || 'Erreur lors de l\'enregistrement';
          return throwError(() => message);
        })
      );
  }

  // Se connecter
  login(request: LoginRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.apiUrl}/sign-in`, request)
      .pipe(
        tap(session => {
          this.storeSession(session);
          this.sessionSubject.next(session);
          this.userSubject.next(session.user);
        }),
        catchError(error => {
          const message = error.error?.message || error.error?.error || 'Erreur lors de la connexion';
          return throwError(() => message);
        })
      );
  }

  // Se déconnecter
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sign-out`, {})
      .pipe(
        tap(() => {
          this.clearToken();
          this.sessionSubject.next(null);
          this.userSubject.next(null);
        }),
        catchError(error => {
          this.clearToken();
          this.sessionSubject.next(null);
          this.userSubject.next(null);
          return throwError(() => 'Erreur lors de la déconnexion');
        })
      );
  }

  getSession(): Observable<AuthSession> {
    const headers = { 'Authorization': `Bearer ${this.getToken()}` };
    return this.http.get<AuthSession>(`${this.apiUrl}/session`, { headers })
      .pipe(
        tap(session => {
          this.storeSession(session);
          this.userSubject.next(session.user);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value && !!this.getToken();
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private storeSession(session: AuthSession): void {
    localStorage.setItem('auth_token', session.session.id);
    localStorage.setItem('auth_user', JSON.stringify(session.user));
  }

  private getStoredUser(): AuthUser | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  }
}