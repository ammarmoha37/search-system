import { Component } from '@angular/core';
import { VideosTasksService } from '@services/videos-tasks.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css',
})
export class VideosComponent {
  videos: any[] = [];
  paginatedVideos: any[] = [];
  itemsPerPage: number = 7;
  totalItems: number = 0;
  searchTerm: string = '';
  selectedStatus: string | null = null;

  constructor(private videoTasksService: VideosTasksService) {}

  ngOnInit() {
    this.videoTasksService.getUserVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.totalItems = videos.length;
        this.setPage(1);
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      },
    });
  }

  setPage(page: number) {
    let filteredVideos = this.videos;

    if (this.searchTerm) {
      filteredVideos = filteredVideos.filter((video) =>
        video.key.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    if (this.selectedStatus) {
      filteredVideos = filteredVideos.filter(
        (video) => video.status === this.selectedStatus,
      );
    }

    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVideos = filteredVideos.slice(startIndex, endIndex);
    this.totalItems = filteredVideos.length;
    console.log(this.paginatedVideos);

  }

  onSearchChange() {
    this.setPage(1);
  }

  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.setPage(1);
  }
}
