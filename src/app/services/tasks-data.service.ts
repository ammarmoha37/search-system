import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideosTasksService } from './videos-tasks.service';
import { AuthService } from './auth.service';

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
  ) {
    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.fetchTasksStatus();
      } else {
        this.clearTasksData();
      }
    });
  }

  fetchTasksStatus(): void {
    this.videosTasksService.getTasksStatus().subscribe((tasks) => {
      this.tasksSubject.next({ total: tasks.total, done: tasks.done });
    });
  }

  updateTasks(tasks: { total: number; done: number }): void {
    this.tasksSubject.next(tasks);
  }

  clearTasksData(): void {
    this.tasksSubject.next({ total: 0, done: 0 });
  }
}
