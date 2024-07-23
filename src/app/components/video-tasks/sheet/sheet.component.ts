import { Component } from '@angular/core';
import { VideosTasksService } from '@services/videos-tasks.service';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
})
export class SheetComponent {
  clips: any[] = [];
  persons: any[] = [];
  expandedClips: boolean[] = [];
  ShowPersons: boolean = false;

  constructor(private videoService: VideosTasksService) {}

  ngOnInit(): void {}

  fetchClips(): void {
    this.videoService.getDefaultVideoData().subscribe((data) => {
      this.clips = data.sheet || [];

      this.persons = data.persons;
      console.log(this.persons);
      this.expandedClips = new Array(this.clips.length).fill(false);
    });
  }

  toggleClip(index: number): void {
    this.expandedClips[index] = !this.expandedClips[index];
  }

  isClipExpanded(index: number): boolean {
    return this.expandedClips[index];
  }

  OpenPersonsGallery(): void {
    this.ShowPersons = true;
  }

  closePersonsGallery(): void {
    this.ShowPersons = false;
  }
}
