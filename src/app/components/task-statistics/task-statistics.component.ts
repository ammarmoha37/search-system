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

  constructor(
    private router: Router,
    private tasksService: TasksDataService,
  ) {}

  ngOnInit(): void {
    this.tasksService.fetchTasksStatus();
    this.tasksService.tasks$.subscribe((tasks) => {
      this.doneTasks = tasks.done;
      this.totalTasks = tasks.total;
      this.calculateTaskStatus(this.doneTasks, this.totalTasks);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setCurrentClass();
      });

    // console.log(this.isAdminDashboard);
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
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

  // fetchTasksStatus(): void {
  //   this.tasksService.getTasksStatus().subscribe((status) => {
  //     const totalTasks = status.done + status.remaining;
  //     this.donePercentage =
  //       totalTasks > 0 ? (status.done / totalTasks) * 100 : 0;
  //     this.remainingPercentage =
  //       totalTasks > 0 ? (status.remaining / totalTasks) * 100 : 0;
  //     this.updateGradientStyle();
  //   });
  // }

  updateGradientStyle(): void {
    const doneColor = '#0066FF';
    const remainingColor = '#E6F0FF';
    this.gradientStyle = {
      background: `conic-gradient(${doneColor} 0% ${this.donePercentage}%, ${remainingColor} ${this.donePercentage}% 100%)`,
    };
  }

  // You can use this method to dynamically update the percentages
  setPercentages(done: number, remaining: number): void {
    this.donePercentage = done;
    this.remainingPercentage = remaining;
    this.updateGradientStyle();
  }

  setCurrentClass(): void {
    const url = this.router.url;
    this.isAdminDashboard = url.includes('admin-dashboard');

    // if (url.includes('video-tasks')) {
    //   this.isAdminDashboard = false;
    // } else if (url.includes('admin-dashboard')) {
    //   this.isAdminDashboard = true;
    // }
  }
}
