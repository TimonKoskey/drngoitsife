import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class SignInGuard implements CanActivate {

  constructor(
    private router: Router,
    private authservice: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const token = this.authservice.getToken();
      if (token) {
        this.router.navigate(['/account']);
      } else {
        return true;
      }
  }
}
