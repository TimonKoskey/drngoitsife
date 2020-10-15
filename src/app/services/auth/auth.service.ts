import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { PersistenceService, StorageType } from 'angular-persistence';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userUrl = `http://10.128.0.8:8000/users`;

  constructor(
    private persistence: PersistenceService,
    private http: HttpClient
  ) { }

  saveToken(token: string) {
      this.persistence.set('token', token, { type: StorageType.SESSION });
  }

  getToken() {
      return this.persistence.get('token', StorageType.SESSION);
  }

  loginUser(username: string, password: string) {
      return this.http.post(`${this.userUrl}/api-token-auth`, {
          'username': username,
          'password': password
      });
  }

  getUserData(): Observable<User> {
      return this.http.get<User>(`${this.userUrl}/details`);
  }

  removeDataFromSessionStorage() {
      return this.persistence.removeAll(StorageType.SESSION);
  }

}