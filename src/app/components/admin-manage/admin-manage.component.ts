import { Component } from '@angular/core';
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

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit() {
    this.fetchDefaultVideoData();
  }

  fetchDefaultVideoData(): void {
    this.adminService.getAdminData().subscribe((data) => {
      console.log(data);
      this.res = data.researchers;
      this.totalItems = this.res.length;
      this.setPage(1);
    });
  }

  setPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.researchers = this.res.slice(startIndex, endIndex);
  }

  calculateCompletionPercentage(done: number, total: number): number {
    if (total === 0) {
      return 0; // Avoid division by zero
    }
    return parseFloat(((done / total) * 100).toFixed(2));
  }

}
