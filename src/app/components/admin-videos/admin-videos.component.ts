import { Component } from '@angular/core';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-admin-videos',
  templateUrl: './admin-videos.component.html',
  styleUrl: './admin-videos.component.css',
})
export class AdminVideosComponent {
  videos: any[] = [];
  paginatedVideos: any[] = [];
  itemsPerPage: number = 7;
  totalItems: number = 0;

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit() {
    this.adminService.getAllVideos().subscribe(
      (data) => {
        this.videos = data;
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
    this.paginatedVideos = this.videos.slice(startIndex, endIndex);
        console.log('paginatedVideos:', this.paginatedVideos);

  }
}
