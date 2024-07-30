import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  completionPercentage: number;
  isAddingTask: boolean = false;
  isEditingTask: boolean = false;
  researchers: any = [];
  selectedUserId: number | null = null;

  constructor(
    private adminService: AdminDashboardService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.fetchDefaultVideoData();

    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  fetchDefaultVideoData(): void {
    this.adminService.getAdminData().subscribe((data) => {
      console.log(data);
      this.researchers = data.researchers;
    });
  }

  calculateCompletionPercentage(done: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return parseFloat(((done / total) * 100).toFixed(2));
  }

  handleOutsideClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (this.isAddingTask && !this.el.nativeElement.contains(targetElement)) {
      this.isAddingTask = false;
    }
  }

  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }

  onTaskAdded() {
    this.fetchDefaultVideoData();
  }

  onTaskEdited() {
    this.fetchDefaultVideoData();
  }

  onEditTask(userId: number): void {
    this.selectedUserId = userId;
    this.isEditingTask = true;
  }
}
