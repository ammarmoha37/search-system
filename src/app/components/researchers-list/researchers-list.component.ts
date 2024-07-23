import { Component } from '@angular/core';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-researchers-list',
  templateUrl: './researchers-list.component.html',
  styleUrl: './researchers-list.component.css',
})
export class ResearchersListComponent {
  researchers: any[] = [];
  paginatedResearchers: any[] = [];
  itemsPerPage: number = 7;
  totalItems: number = 0;
  isClipDialogVisible = false;

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit() {
    this.adminService.getAllResearchers().subscribe(
      (data) => {
        this.researchers = data;
        this.totalItems = data.length;
        this.setPage(1);
        console.log('Videos:', data);
      },
      (error) => {
        console.error('Error fetching videos:', error);
      },
    );
  }

  setPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResearchers = this.researchers.slice(startIndex, endIndex);
    console.log('paginatedVideos:', this.paginatedResearchers);
  }
}
