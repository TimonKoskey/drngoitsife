import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { APIService } from '../api/api.service';
import { User } from '../../models/user';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private apiservice: APIService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // const user: User = this.apiservice.appUser;
      // if (user.is_superuser) {
      //   return true;
      // } else {
      //   this.router.navigate(['/account']);
      // }
      return true;
  }
}

