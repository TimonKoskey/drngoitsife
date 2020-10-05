import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';

import { SignInGuard } from './services/guards/sign-in.guard';
import { AuthGuard } from './services/guards/auth.guard';


const routes: Routes = [

  { path: '',   redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent, canActivate: [SignInGuard] },

  { path: 'account', loadChildren: () => import('./main/main.module').then(m => m.MainModule),canActivate: [AuthGuard] },

  { path: 'session', loadChildren: () => import('./session/session.module').then(m => m.SessionModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [ SignInGuard, AuthGuard ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
