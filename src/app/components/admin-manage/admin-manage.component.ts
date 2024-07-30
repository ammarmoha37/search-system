import { Component, ElementRef } from '@angular/core';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css',
})
export class AdminManageComponent {
  completionPercentage: number;
  res: any = [];
  researchers: any = [];
  totalItems: number = 0;
  itemsPerPage: number = 5;
  isAddingTask: boolean = false;
  isEditingTask: boolean = false;
  selectedUserId: number | null = null;
  filteredResearchers: any[] = [];
  searchTerm: string = '';

  constructor(
    private adminService: AdminDashboardService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.fetchDefaultVideoData();
  }

  fetchDefaultVideoData(): void {
    this.adminService.getAdminData().subscribe((data) => {
      this.res = data.researchers;
      this.applySearchFilter(this.searchTerm);
    });
  }

  applySearchFilter(searchTerm: string): void {
    this.filteredResearchers = this.res.filter((researcher) =>
      researcher.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    this.totalItems = this.filteredResearchers.length;
    this.setPage(1);
    console.log(this.filteredResearchers);

  }

  setPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.researchers = this.filteredResearchers.slice(startIndex, endIndex);
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

  onSearchChange() {
    this.applySearchFilter(this.searchTerm);
  }
}
