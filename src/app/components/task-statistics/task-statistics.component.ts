import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TasksDataService } from '@services/tasks-data.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-statistics',
  templateUrl: './task-statistics.component.html',
  styleUrl: './task-statistics.component.css',
})
export class TaskStatisticsComponent implements OnInit, OnDestroy {
  donePercentage: number = 0;
  remainingPercentage: number = 0;
  gradientStyle: any = {};
  doneTasks: number;
  totalTasks: number;
  isAdminDashboard: boolean;
  private taskSubscription: Subscription;
  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private tasksService: TasksDataService,
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setCurrentClass();
        this.tasksService.fetchTasksStatus();
      });

    this.taskSubscription = this.tasksService.tasks$.subscribe((tasks) => {
      this.doneTasks = tasks.done;
      this.totalTasks = tasks.total;
      this.calculateTaskStatus(this.doneTasks, this.totalTasks);
    });

    this.setCurrentClass();
    this.tasksService.fetchTasksStatus();
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    if (this.taskSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  calculateTaskStatus(done: number, total: number): void {
    const remaining = total - done;
    this.donePercentage =
      total > 0 ? parseFloat(((done / total) * 100).toFixed(2)) : 0;
    this.remainingPercentage =
      total > 0 ? parseFloat(((remaining / total) * 100).toFixed(2)) : 0;

    this.updateGradientStyle();
  }

  updateGradientStyle(): void {
    const doneColor = '#0066FF';
    const remainingColor = '#E6F0FF';
    this.gradientStyle = {
      background: `conic-gradient(${doneColor} 0% ${this.donePercentage}%, ${remainingColor} ${this.donePercentage}% 100%)`,
    };
  }

  setPercentages(done: number, remaining: number): void {
    this.donePercentage = done;
    this.remainingPercentage = remaining;
    this.updateGradientStyle();
  }

  setCurrentClass(): void {
    const url = this.router.url;
    this.isAdminDashboard = url.includes('admin-dashboard');
    console.log(this.isAdminDashboard);
  }
}
