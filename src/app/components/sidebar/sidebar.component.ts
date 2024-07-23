import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { TasksDataService } from '@services/tasks-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  userRole: string = 'researcher';
  userData: any;
  userName: string;
  private userDataSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tasksDataService: TasksDataService,
  ) {}

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  ngOnInit(): void {
    this.userDataSubscription = this.authService.userData$.subscribe((data) => {
      this.userData = data;
      const role = this.userData?.type;
      this.userName = this.userData?.name;

      if (role == '0') {
        this.userRole = 'باحث';
      } else if (role == 3) {
        this.userRole = 'مدير المشروع';
      }
    });
  }

  getRouterLink(): string {
    if (this.userRole === 'admin') {
      return '/admin-videos';
    } else if (this.userRole === 'user') {
      return '/user-videos';
    } else {
      return '/videos';
    }
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.tasksDataService.clearTasksData();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
