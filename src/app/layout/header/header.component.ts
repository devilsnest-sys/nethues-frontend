import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone : false,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username$;
  
  constructor(private auth: AuthService, public router: Router) {
    this.username$ = this.auth.username$;
  }
  // this.username$ = this.auth.username$;
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
