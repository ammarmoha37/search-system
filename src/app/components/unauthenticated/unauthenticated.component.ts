import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthenticated',
  templateUrl: './unauthenticated.component.html',
  styleUrl: './unauthenticated.component.css',
})
export class UnauthenticatedComponent {
  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
