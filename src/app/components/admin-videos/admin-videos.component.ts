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
  filteredVideos: any[] = [];
  itemsPerPage: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  researchers: any[] = [];
  selectedResearcherId: string | null = null;
  selectedStatus: string | null = null;
  isClippingTasks: boolean = false;
  selectedVideoId: number | null = null;

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit() {
    this.adminService.getAllVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.filteredVideos = data;
        this.totalItems = data.length;
        this.setPage(1);
        this.getResearchers();
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      },
    });
  }

  getResearchers() {
    const researcherMap = new Map();
    this.videos.forEach((video) => {
      if (!researcherMap.has(video.user_id)) {
        researcherMap.set(video.user_id, video.user_name);
      }
    });
    this.researchers = Array.from(researcherMap.entries()).map(
      ([user_id, user_name]) => ({ user_id, user_name }),
    );
  }

  onSearchChange() {
    this.applyFilters();
  }

  onResearcherChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedResearcherId = target.value;
    this.applyFilters();
  }

  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.videos;

    if (this.searchTerm) {
      filtered = filtered.filter((video) =>
        video.video_key.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    if (this.selectedResearcherId) {
      filtered = filtered.filter(
        (video) => video.user_id == this.selectedResearcherId,
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(
        (video) => video.video_status === this.selectedStatus,
      );
    }

    this.filteredVideos = filtered;
    this.totalItems = filtered.length;
    this.setPage(1);
  }

  setPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVideos = this.filteredVideos.slice(startIndex, endIndex);
    console.log('Paginated Videos:', this.paginatedVideos);
  }

  onClippingTasks(videoId: number) {
    this.selectedVideoId = videoId;
    this.isClippingTasks = true;
    console.log('Selected Video ID:', this.selectedVideoId);
  }
}
