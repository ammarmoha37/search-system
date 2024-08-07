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
  @Output() videoClipped = new EventEmitter<void>();
  @Input() defaultVideoId: number | null = null;

  expandedClips: boolean[] = [];
  videoDetails: any = {};
  initialVideoDetails: any = {};
  clips: any[] = [];
  initialClips: any[] = [];
  fileInputs: any[] = [];
  successMessage: string | null = null;

  countrySuggestions: string[] = [];
  showCountrySuggestions = false;
  countries = [];
  eventTypeSuggestions: string[] = [];
  showEventTypeSuggestions = false;
  // addresses = [];
  // addressSuggestions: string[] = [];
  // showAddressSuggestions = false;
  events = [];
  personSuggestions: string[] = [];
  showPersonSuggestions = false;
  persons = [];
  focusedPersonIndex: { clipIndex: number; personIndex: number } | null = null;

  customErrors = {
    startTimeAfterEndTime: false,
    endTimeAfterDuration: false,
  };

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
        this.countries = data.countries.map((item: any) => item.country);
        // this.addresses = data.addresses.map((item: any) => item.address);
        this.events = data.events.map((item: any) => item.type_name);
        this.persons = data.persons;
        console.log(this.persons);

        this.initialVideoDetails = { ...this.videoDetails };
        this.initialClips = JSON.parse(JSON.stringify(this.clips));

        console.log('Fetched Video Details:', data);
      },
      error: (error) => {
        console.error('Error fetching video details:', error);
      },
    });
  }

  trackByPerson(index: number, person: any): any {
    return person.id || index;
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

  validateTimes(start_time: string, end_time: string) {
    console.log('validateTimes called');

    this.customErrors.startTimeAfterEndTime = false;
    this.customErrors.endTimeAfterDuration = false;

    const startTime = this.parseTime(start_time);
    const endTime = this.parseTime(end_time);
    const duration = this.parseTime(this.videoDetails.video_duration);

    console.log(this.videoDetails.video_duration);

    console.log(
      'startTime:',
      startTime,
      'endTime:',
      endTime,
      'duration:',
      duration,
    );

    if (startTime !== null && endTime !== null) {
      if (startTime >= endTime) {
        this.customErrors.startTimeAfterEndTime = true;
        console.log(this.customErrors.startTimeAfterEndTime);
      }

      if (endTime > duration) {
        this.customErrors.endTimeAfterDuration = true;
      }
    }
  }

  parseTime(timeStr: string) {
    const timeParts = timeStr.split(':');
    if (timeParts.length === 3) {
      return +timeParts[0] * 3600 + +timeParts[1] * 60 + +timeParts[2];
    }
    return null;
  }

  normalizeArabic(text: string): string {
    return text.replace(/أ|إ|آ/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  }

  // showAllAddressSuggestions() {
  //   this.addressSuggestions = [...this.addresses];
  //   this.showAddressSuggestions = true;
  // }

  showAllCountrySuggestions(): void {
    this.countrySuggestions = [...this.countries];
    this.showCountrySuggestions = true;
  }

  showAllEventSuggestions(): void {
    this.eventTypeSuggestions = [...this.events];
    this.showEventTypeSuggestions = true;
  }

  filterEventTypeSuggestions(query: string): void {
    if (query) {
      const normalizedQuery = this.normalizeArabic(query);
      this.eventTypeSuggestions = this.events.filter((eventType) =>
        this.normalizeArabic(eventType).includes(normalizedQuery),
      );
    } else {
      this.showAllEventSuggestions();
    }
  }

  selectEventTypeSuggestion(suggestion: string): void {
    this.videoDetails.event_type = suggestion;
    this.showEventTypeSuggestions = false;
  }

  // filterAddressSuggestions(query: string): void {
  //   if (query) {
  //     const normalizedQuery = this.normalizeArabic(query);
  //     this.addressSuggestions = this.addresses.filter((address) =>
  //       this.normalizeArabic(address).includes(normalizedQuery),
  //     );
  //   } else {
  //     this.showAllAddressSuggestions();
  //   }
  // }

  // selectAddressSuggestion(suggestion: string): void {
  //   this.videoDetails.addresses = suggestion;
  //   this.showAddressSuggestions = false;
  // }

  filterCountrySuggestions(query: string): void {
    if (query) {
      const normalizedQuery = this.normalizeArabic(query);
      this.countrySuggestions = this.countries.filter((country) =>
        this.normalizeArabic(country).includes(normalizedQuery),
      );
    } else {
      this.showAllCountrySuggestions();
    }
  }

  selectCountrySuggestion(suggestion: string): void {
    this.videoDetails.country = suggestion;
    this.showCountrySuggestions = false;
  }

  filterPersonSuggestions(
    query: string,
    clipIndex: number,
    personIndex: number,
  ): void {
    if (query) {
      const normalizedQuery = this.normalizeArabic(query);
      this.personSuggestions = this.persons.filter((person) =>
        this.normalizeArabic(person.character_name).includes(normalizedQuery),
      );
      this.focusedPersonIndex = { clipIndex, personIndex };
    } else {
      this.personSuggestions = [];
      this.focusedPersonIndex = null;
    }
  }

  onFocusPersonInput(clipIndex: number, personIndex: number) {
    this.focusedPersonIndex = { clipIndex, personIndex };
  }

  selectPersonSuggestion(
    clipIndex: number,
    personIndex: number,
    suggestion: any,
  ): void {
    this.clips[clipIndex].persons[personIndex].name = suggestion.character_name;
    this.clips[clipIndex].persons[personIndex].photo = suggestion.photo;

    this.personSuggestions = [];
    this.focusedPersonIndex = null;
  }

  updateVideo() {
    const formData = new FormData();

    formData.append('videoDetails', JSON.stringify(this.videoDetails));

    this.clips.forEach((clip, clipIndex) => {
      formData.append(`clips[${clipIndex}][clip_id]`, clip.clip_id.toString());
      formData.append(`clips[${clipIndex}][key]`, clip.key);
      formData.append(`clips[${clipIndex}][start_time]`, clip.start_time);
      formData.append(`clips[${clipIndex}][end_time]`, clip.end_time);
      formData.append(`clips[${clipIndex}][clip_title]`, clip.clip_title);
      formData.append(
        `clips[${clipIndex}][clip_status]`,
        clip.clip_status.toString(),
      );
      formData.append(`clips[${clipIndex}][thumbnail]`, clip.thumbnail);
      formData.append(`clips[${clipIndex}][caption]`, clip.caption);

      clip.persons.forEach((person, personIndex) => {
        formData.append(
          `clips[${clipIndex}][persons][${personIndex}][name]`,
          person.name,
        );

        if (person.photo) {
          formData.append(
            `clips[${clipIndex}][persons][${personIndex}][photo]`,
            person.photo,
          );
        }
      });
    });

    console.log('FormData:', formData);

    this.adminService.updateVideoData(formData).subscribe({
      next: () => {
        console.log('Video and clips updated successfully');
        this.successMessage = 'تم حفظ البيانات بنجاح';
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);

        // this.initialVideoDetails = { ...this.videoDetails };
        // this.initialClips = JSON.parse(JSON.stringify(this.clips));

        this.fetchVideoDetails(this.defaultVideoId);
      },
      error: (error) => {
        console.error('Error updating video details:', error);
      },
    });
  }

  handleFileInput(event: Event, clipIndex: number, personIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const person = this.clips[clipIndex]?.persons[personIndex];

      if (person) {
        person.photo = file;
        console.log(person.photo);
      }
    }
  }

  getPersonPhotoUrl(file: File): any {
    if (file instanceof File) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    return file;
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
        this.videoClipped.emit();
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
}
