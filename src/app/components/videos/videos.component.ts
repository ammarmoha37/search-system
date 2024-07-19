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
  totalItems: number = 0; // Initialize totalItems to zero

  constructor(private videoTasksService: VideosTasksService) {}

  ngOnInit() {
    this.videoTasksService.getAllVideos().subscribe(
      (videos) => {
        this.videos = videos;
        this.totalItems = videos.length;
        this.setPage(1);
        console.log('Videos:', videos);
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
  }
}
