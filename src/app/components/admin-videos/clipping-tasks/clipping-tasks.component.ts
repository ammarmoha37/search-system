import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-clipping-tasks',
  templateUrl: './clipping-tasks.component.html',
  styleUrl: './clipping-tasks.component.css',
})
export class ClippingTasksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() defaultVideoId: number | null = null;
  expandedClips: boolean[] = [];
  videoDetails: any = {};
  initialVideoDetails: any = {};
  clips: any[] = [];
  initialClips: any[] = [];
  fileInputs: any[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private adminService: AdminDashboardService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.close.emit();
      }
    });

    if (this.defaultVideoId !== null) {
      this.fetchVideoDetails(this.defaultVideoId);
    }
  }

  fetchVideoDetails(videoId: number): void {
    this.adminService.getVideoDetails(videoId).subscribe({
      next: (data) => {
        this.videoDetails = data.video;
        this.clips = data.clips;
        this.initialVideoDetails = { ...this.videoDetails };
        this.initialClips = JSON.parse(JSON.stringify(this.clips)); // Deep clone clips

        console.log('Fetched Video Details:', data);
      },
      error: (error) => {
        console.error('Error fetching video details:', error);
      },
    });
  }

  getClipStatusMessage(clip_status: number): string {
    switch (clip_status) {
      case 0:
        return 'بانتظار المراجعة';
      case 1:
        return 'تم التقطيع';
      case -1:
        return 'فشل التقطيع';
      default:
        return 'حالة غير معروفة';
    }
  }

  hasVideoChanges(): boolean {
    return (
      JSON.stringify(this.videoDetails) !==
      JSON.stringify(this.initialVideoDetails)
    );
  }

  hasClipChanges(): boolean {
    return JSON.stringify(this.clips) !== JSON.stringify(this.initialClips);
  }

  hasClipChanged(clipIndex: number): boolean {
    return (
      JSON.stringify(this.clips[clipIndex]) !==
      JSON.stringify(this.initialClips[clipIndex])
    );
  }

  // if (this.hasVideoChanges() || this.hasClipChanges()) {
  //   console.log('data changed');
  //   console.log(this.initialVideoDetails);
  //   console.log(this.videoDetails);
  //   console.log(this.initialClips);
  //   console.log(this.clips);
  // }

  // if (this.hasClipChanged(clipIndex)) {
  //   console.log('clip data changed');
  //   console.log(this.initialClips);
  //   console.log(this.clips);

  // }

  updateVideo() {
    const videoData = {
      videoDetails: this.videoDetails,
      clips: this.clips,
    };

    console.log(videoData);

    this.adminService.updateVideoData(videoData).subscribe({
      next: () => {
        console.log('Video and clips updated successfully');
        console.log(videoData);

        this.initialVideoDetails = { ...this.videoDetails };
        this.initialClips = JSON.parse(JSON.stringify(this.clips));
      },
      error: (error) => {
        console.error('Error updating video details:', error);
      },
    });
  }

  cutAllVideo(): void {
    const cutVideoData = {
      video_id: this.defaultVideoId,
      cutting_type: 1,
    };

    console.log('video details in the clipping: ', this.videoDetails);
    console.log('clips in the clipping: ', this.clips);

    this.adminService.cutVideo(cutVideoData).subscribe({
      next: (response) => {
        console.log('Video cut successfully:', response);
        this.close.emit();
      },
      error: (error) => {
        console.error('Error cutting video:', error);
      },
    });

    this.close.emit();
  }

  cutClip(clipId: number): void {
    const cutClipData = {
      video_id: this.defaultVideoId,
      cutting_type: 0,
      clip_id: clipId,
    };

    this.adminService.cutVideo(cutClipData).subscribe({
      next: (response) => {
        console.log('Clip cut successfully:', response);
        this.close.emit();
      },
      error: (error) => {
        console.error('Error cutting clip:', error);
      },
    });

    this.close.emit();
  }

  onClickInside(event: MouseEvent): void {
    event.stopPropagation();
  }

  toggleClip(index: number): void {
    this.expandedClips[index] = !this.expandedClips[index];
  }

  isClipExpanded(index: number): boolean {
    return this.expandedClips[index];
  }

  addClip() {
    const maxClipId = this.clips.reduce(
      (maxId, clip) => Math.max(maxId, clip.clip_id),
      0,
    );

    const newClipId = maxClipId + 1;
    const nextClipNumber = this.clips.length + 1;
    let newClipKey = this.videoDetails.video_code;
    const fileExtensionIndex = this.videoDetails.video_code.lastIndexOf('.');

    if (fileExtensionIndex !== -1) {
      const baseKey = this.videoDetails.video_code.substring(
        0,
        fileExtensionIndex,
      );
      const fileExtension =
        this.videoDetails.video_code.substring(fileExtensionIndex);
      newClipKey = `${baseKey}-${nextClipNumber}${fileExtension}`;
    }

    const newClip = {
      clip_id: newClipId,
      key: newClipKey,
      start_time: '',
      end_time: '',
      clip_title: '',
      clip_status: 0,
      thumbnail: '',
      caption: '',
      persons: [{ name: '', photo: null }],
    };
    this.clips.push(newClip);
  }

  deleteClip(index: number) {
    if (confirm('Are you sure you want to delete this clip?')) {
      this.clips.splice(index, 1);
    }
  }

  addPerson(clipIndex: number): void {
    this.clips[clipIndex].persons.push({ name: '', photo: null });
  }

  deletePerson(clipIndex: number, personIndex: number): void {
    this.clips[clipIndex].persons.splice(personIndex, 1);
  }

  handleFileInput(event: any, clipIndex: number, personIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const photoUrl = e.target.result;
        const person = this.clips[clipIndex].persons[personIndex];
        person.photo = photoUrl;
      };

      reader.readAsDataURL(file);
    }
  }

  getPersonPhotoUrl(file: File): any {
    if (file instanceof File) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    return this.sanitizer.bypassSecurityTrustUrl(file);
  }
}
