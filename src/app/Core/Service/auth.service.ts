import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { IUser } from '../Model/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  URL: string = 'http://localhost:3000/users';
  currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isLogged: Subject<boolean> = new Subject<boolean>();
  Logged: boolean = false;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isLoggedIn() {
    return this.isLogged.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    this.isLogged.next(true);
    localStorage.setItem('username', username);
    this.router.navigate(['/']);
    return this.http
      .get<IUser[]>(`${this.URL}?username=${username}&password=${password}`)
      .pipe(
        tap((users) => {
          if (users.length === 1) {
            const user = users[0];
            this.currentUserSubject.next(user);
            localStorage.setItem('username', username);
          } else {
            throw new Error('Invalid username or password');
          }
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    const user = { username, password };
    return this.http.post<any>(this.URL, user).pipe(
      tap((response) => {
        localStorage.setItem('username', response.username);
      })
    );
  }
  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
    return this.isLogged.next(false);
  }
  isLoggedIn$(): Observable<boolean> {
    return of(this.Logged);
  }

  LoggedIn(): any {
    const currentUser = localStorage.getItem('username');
    if (currentUser === null) {
      return false;
    }
    return true;
  }
}
