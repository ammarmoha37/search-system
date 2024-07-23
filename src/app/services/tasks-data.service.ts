import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { VideosTasksService } from './videos-tasks.service';
import { AuthService } from './auth.service';
import { AdminDashboardService } from './admin-dashboard.service';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TasksDataService {
  private tasksSubject = new BehaviorSubject<{ total: number; done: number }>({
    total: 0,
    done: 0,
  });

  tasks$ = this.tasksSubject.asObservable();

  constructor(
    private videosTasksService: VideosTasksService,
    private authService: AuthService,
    private adminDashboardService: AdminDashboardService,
    private router: Router,
  ) {
    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.fetchTasksStatus();
      } else {
        this.clearTasksData();
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchTasksStatus();
      });
  }

  fetchTasksStatus(): void {
    if (this.router.url.includes('admin-dashboard')) {
      this.adminDashboardService.getAdminData().subscribe((adminData) => {
        this.tasksSubject.next({
          total: adminData.total_videos,
          done: adminData.done_videos,
        });
      });
    } else {
      this.videosTasksService.getTasksStatus().subscribe((tasks) => {
        this.tasksSubject.next({ total: tasks.total, done: tasks.done });
      });
    }
  }

  clearTasksData(): void {
    this.tasksSubject.next({ total: 0, done: 0 });
  }
}
