import { Component, EventEmitter, Output } from '@angular/core';
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

  @Output() personSelected = new EventEmitter<any>();

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

  clearData(): void {
    this.clips = [];
    this.persons = [];
    this.expandedClips = [];
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

  selectPerson(person: { character_name: string; photo: string }): void {
    this.personSelected.emit(person);
    this.closePersonsGallery();
  }
}
