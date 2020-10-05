import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { APIService } from '../services/api/api.service';
import { User } from '../models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: User;
  @ViewChild('afyaMain', {static: false}) afyaMain: any;
  sidebarOpen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authservice: AuthService,
    private apiservice: APIService
  ) { }

  ngOnInit() {
    this.authservice.getUserData().subscribe(results => {
      this.user = results;
      this.apiservice.setUser(this.user);
    }, error => {
      console.error(error);
    });
  }

  navOneStepBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  logout() {
    this.authservice.removeDataFromSessionStorage();
    this.router.navigate(['/sign-in']);
  }

  toggleSidebar() {
    if (this.sidebarOpen) {
      this.renderer.removeClass(
        this.afyaMain.nativeElement,
        'toggled'
      )
      this.sidebarOpen = false;
    } else {
      this.renderer.addClass(
        this.afyaMain.nativeElement,
        'toggled'
      )
      this.sidebarOpen = true;
    }
  }

  removeSidebar() {
    this.renderer.removeClass(
      this.afyaMain.nativeElement,
      'toggled'
    );
  }
}
