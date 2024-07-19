import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'search-system';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.authService.fetchUserData().subscribe();
    }
  }
}
