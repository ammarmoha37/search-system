import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-disabled-videos',
  templateUrl: './disabled-videos.component.html',
  styleUrl: './disabled-videos.component.css',
})
export class DisabledVideosComponent implements OnInit {
  videoKey: string = '';
  successMessage: string | null = null;
  isDisabled: boolean = false;

  videos: any[] = [];
  itemsPerPage: number = 10;
  totalItems: number = 0;
  paginatedVideos: any[] = [];
  filteredVideos: any[] = [];
  researchers: any[] = [];
  searchTerm: string = '';
  selectedResearcherId: string | null = null;

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit(): void {
    this.getDisabledVideos();
  }

  getDisabledVideos() {
    this.adminService.getAllDisabledVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.filteredVideos = data;
        this.totalItems = data.length;
        this.getResearchers(); // Ensure researchers are fetched
        this.setPage(1); // Initialize with the first page
      },
      error: (error) => {
        console.error('Error fetching disabled videos', error);
        // Handle error (e.g., show an error message)
      },
    });
  }

  disableVideo(videoKey) {
    console.log('video disabled');
    console.log(videoKey);

    if (videoKey.trim()) {
      console.log(videoKey);
      this.adminService.disableVideo(videoKey).subscribe({
        next: (response) => {
          console.log('Video disabled successfully', response);
          this.successMessage = 'تم تحديث البيانات بنجاح!';
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);

          this.videoKey = '';

          this.getDisabledVideos();
        },
        error: (error) => {
          console.error('Error disabling video', error);
          // Handle error (e.g., show an error message)
        },
      });
    } else {
      // Handle empty input case
      console.error('Video key is required');
    }
  }

  enableVideo(videoKey: string) {
    console.log('Enabling video with key:', videoKey);

    if (videoKey.trim()) {
      this.adminService.enabledVideos(videoKey).subscribe({
        next: (response) => {
          console.log('Video enabled successfully', response);
          // this.successMessage = 'تم تفعيل الفيديو بنجاح!';
          // setTimeout(() => {
          //   this.successMessage = null;
          // }, 5000);

          // Refresh the list of disabled videos
          this.getDisabledVideos();
        },
        error: (error) => {
          console.error('Error enabling video', error);
          // Handle error (e.g., show an error message)
        },
      });
    } else {
      // Handle empty input case
      console.error('Video key is required');
    }
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

  applyFilters() {
    let filtered = this.videos;

    console.log('Initial filtered videos:', filtered);

    if (this.searchTerm) {
      filtered = filtered.filter((video) =>
        video.video_key.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
      console.log('After search filter:', filtered);
    }

    if (this.selectedResearcherId) {
      filtered = filtered.filter(
        (video) => video.user_id == this.selectedResearcherId,
      );
      console.log('After researcher filter:', filtered);
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
}
