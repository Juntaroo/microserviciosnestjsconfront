import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  list(): Observable<User[]> {
    return this.http.get<User[]>(`${API}/users`);
  }

  get(id: string) {
    return this.http.get<User>(`${API}/users/${id}`);
  }

  update(id: string, payload: Partial<User>) {
    return this.http.put(`${API}/users/${id}`, payload);
  }

  // etc.
}
