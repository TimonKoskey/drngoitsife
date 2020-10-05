import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.auth.getToken();
      const newReq = req.clone(this.createHeaders(token));
      return next.handle(newReq);
    }

    createHeaders(token?: string) {
        const data = {
             'Content-Type': 'application/json',
        };
        if (token) {
          data['authorization'] = `JWT ${token}`;
        }
        const httpOptions = {
            headers: new HttpHeaders(data)
        };
        return httpOptions;
    }
}