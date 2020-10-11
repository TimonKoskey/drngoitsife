import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router'
import { catchError, map } from 'rxjs/operators';
import { retry } from 'rxjs-compat/operator/retry';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
      private auth: AuthService,
      private router: Router
      ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.auth.getToken();
      const newReq = req.clone(this.createHeaders(token));
      return next.handle(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.auth.removeDataFromSessionStorage();
            this.router.navigate(['sign-in']);
          }
          return throwError(error);
        })
      )
      //   map((event: HttpEvent<any>) => {
      //     if (event instanceof HttpErrorResponse) {
      //       console.log('event--->>>', event.status);
      //       // this.auth.removeDataFromSessionStorage();
      //       // this.router.navigate(['sign-in']);
      //     }
      //     return event;
      // }))
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

    // private handleError(error: HttpErrorResponse) {
    //   console.log(error.status)
    //   if (error.status === 401) {
    //     this.auth.removeDataFromSessionStorage();
    //     this.router.navigate(['sign-in']);
    //   }
    //   return throwError(error);
    // }
}