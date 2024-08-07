import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TasksDataService } from '@services/tasks-data.service';
import { VideosTasksService } from '@services/videos-tasks.service';
import { SheetComponent } from './sheet/sheet.component';

@Component({
  selector: 'app-video-tasks',
  templateUrl: './video-tasks.component.html',
  styleUrl: './video-tasks.component.css',
})
export class VideoTasksComponent implements OnInit, OnDestroy {
  showNotification: boolean = false;
  notificationMessage: string[] = [];
  notificationStatus: string;
  expandedClips: boolean[];
  videoForm: FormGroup;
  nextVideoData: any;
  loading: boolean = false;

  isClipDialogVisible = false;
  isPersonDialogVisible = false;
  clipToDeleteIndex: number | null = null;
  personToDeleteIndex: number | null = null;
  personClipIndex: number | null = null;

  // addressSuggestions: string[] = [];
  countrySuggestions: string[] = [];
  eventTypeSuggestions: string[] = [];
  personSuggestions: { character_name: string; photo: string }[] = [];

  showCountrySuggestions = false;
  // showAddressSuggestions = false;
  showPersonSuggestions = false;
  showEventTypeSuggestions = false;

  // addresses = [];
  countries = [];
  persons = [];
  events = [];

  videoData: any = {
    videoId: '',
    videoCode: '',
    videoDuration: '',
  };

  private focusedPersonIndex: {
    clipIndex: number;
    personIndex: number;
  } | null = null;

  @ViewChild(SheetComponent) sheetComponent!: SheetComponent;

  constructor(
    private fb: FormBuilder,
    private videoService: VideosTasksService,
    private sanitizer: DomSanitizer,
    private tasksDataService: TasksDataService,
  ) {
    this.videoForm = this.fb.group({
      videoLink: [{ value: '', disabled: true }],
      videoCode: [{ value: '', disabled: true }],
      videoDuration: [{ value: '', disabled: true }],
      eventDate: ['', Validators.required],
      eventType: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      clipsCount: [{ value: 0, disabled: true }],
      clips: this.fb.array([], Validators.minLength(1)),
    });

    this.expandedClips = [];
  }

  ngOnInit(): void {
    this.addClip(true);
    this.fetchDefaultVideoData();

    // this.videoForm.get('address')!.valueChanges.subscribe((value) => {
    //   this.filterAddressSuggestions(value);
    // });

    this.videoForm.get('country')!.valueChanges.subscribe((value) => {
      this.filterCountrySuggestions(value);
    });

    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const addressInput = document.querySelector(
      'input[formControlName="address"]',
    );
    const countryInput = document.querySelector(
      'input[formControlName="country"]',
    );
    const personInputs = document.querySelectorAll(
      'input[formControlName="personName"]',
    );
    const eventInputs = document.querySelectorAll(
      'input[formControlName="eventType"]',
    );

    const suggestionsList = document.querySelector('.suggestions-list');

    // if (
    //   target !== addressInput &&
    //   !addressInput?.contains(target) &&
    //   !suggestionsList?.contains(target)
    // ) {
    //   this.showAddressSuggestions = false;
    // }
    if (
      target !== countryInput &&
      !countryInput?.contains(target) &&
      !suggestionsList?.contains(target)
    ) {
      this.showCountrySuggestions = false;
    }

    let isClickOutsideEvent = true;
    eventInputs.forEach((input) => {
      if (target === input || input.contains(target)) {
        isClickOutsideEvent = false;
      }
    });
    if (isClickOutsideEvent && !suggestionsList?.contains(target)) {
      this.showEventTypeSuggestions = false;
    }

    const isClickOutsidePerson = Array.from(personInputs).every(
      (input) => target !== input && !input.contains(target),
    );
    if (isClickOutsidePerson && !suggestionsList?.contains(target)) {
      this.showPersonSuggestions = false;
    }
  }

  normalizeArabic(text: string): string {
    return text.replace(/أ|إ|آ/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  }

  // showAllAddressSuggestions(): void {
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

  filterEventTypeSuggestions(query: string): void {
    if (query) {
      const normalizedQuery = this.normalizeArabic(query);
      this.eventTypeSuggestions = this.events.filter((event) =>
        this.normalizeArabic(event).includes(normalizedQuery),
      );
    } else {
      this.showAllEventSuggestions();
    }
  }

  filterPersonSuggestions(query: string): void {
    if (query?.length > 0 && this.focusedPersonIndex) {
      const normalizedQuery = this.normalizeArabic(query);
      this.personSuggestions = this.persons.filter((person) =>
        this.normalizeArabic(person.character_name).includes(normalizedQuery),
      );
      this.showPersonSuggestions = this.personSuggestions.length > 0;
    } else {
      this.showPersonSuggestions = false;
    }
  }

  // selectAddressSuggestion(suggestion: string): void {
  //   this.videoForm.get('address')!.setValue(suggestion);
  //   this.showAddressSuggestions = false;
  // }

  selectCountrySuggestion(suggestion: string): void {
    this.videoForm.get('country')!.setValue(suggestion);
    this.showCountrySuggestions = false;
  }

  selectEventTypeSuggestion(suggestion: string): void {
    this.videoForm.get('eventType')!.setValue(suggestion);
    this.showEventTypeSuggestions = false;
  }

  selectPersonSuggestion(
    clipIndex: number,
    personIndex: number,
    suggestion: { character_name: string; photo: string },
  ): void {
    const personFormArray = this.clips
      .at(clipIndex)
      .get('persons') as FormArray;
    const personFormGroup = personFormArray.at(personIndex) as FormGroup;
    personFormGroup.get('personName')!.setValue(suggestion.character_name);
    personFormGroup.get('personPhoto')!.setValue(suggestion.photo);
    this.showPersonSuggestions = false;
    this.focusedPersonIndex = null;
  }

  handlePersonSelection(person: {
    character_name: string;
    photo: string;
  }): void {
    if (this.focusedPersonIndex) {
      const { clipIndex, personIndex } = this.focusedPersonIndex;
      const personFormArray = this.videoForm
        .get('clips')
        ?.get([clipIndex, 'persons']) as FormArray;
      const personFormGroup = personFormArray.at(personIndex) as FormGroup;
      personFormGroup.get('personName')?.setValue(person.character_name);
      personFormGroup.get('personPhoto')?.setValue(person.photo);
      console.log('photo in input', person.photo);
    }
  }

  toggleClip(index: number) {
    this.expandedClips[index] = !this.expandedClips[index];
  }

  isClipExpanded(index: number): boolean {
    return this.expandedClips[index];
  }

  collapseAllClips(): void {
    this.expandedClips = this.expandedClips.map(() => false);
  }

  get clips(): FormArray {
    return this.videoForm.get('clips') as FormArray;
  }

  addClip(expand: boolean = false): void {
    const clipGroup = this.fb.group({
      timeCodeStart: ['', Validators.required],
      timeCodeEnd: ['', Validators.required],
      timeCodeStartHours: ['00'],
      timeCodeStartMinutes: [''],
      timeCodeStartSeconds: [''],
      timeCodeEndHours: ['00'],
      timeCodeEndMinutes: [''],
      timeCodeEndSeconds: [''],
      caption: ['', Validators.required],
      thumbnail: ['', Validators.required],
      clipTitle: ['', Validators.required],
      persons: this.fb.array(
        [this.createPersonGroup()],
        Validators.minLength(1),
      ),
    });

    this.clips.push(clipGroup);
    this.setupPersonNameValueChanges(this.clips.length - 1);

    if (!expand) {
      this.collapseAllClips();
    }
    this.expandedClips.push(true);
  }

  createPersonGroup(): FormGroup {
    return this.fb.group({
      personName: ['', Validators.required],
      personPhoto: [null, Validators.required],
    });
  }

  addPerson(clipIndex: number): void {
    const personsArray = this.clips.at(clipIndex).get('persons') as FormArray;
    personsArray.push(this.createPersonGroup());
    this.setupPersonNameValueChanges(clipIndex, personsArray.length - 1);
  }

  setupPersonNameValueChanges(
    clipIndex: number,
    personIndex: number = 0,
  ): void {
    const personsArray = this.clips.at(clipIndex).get('persons') as FormArray;
    const personFormGroup = personsArray.at(personIndex) as FormGroup;

    personFormGroup.get('personName')!.valueChanges.subscribe((value) => {
      this.focusedPersonIndex = { clipIndex, personIndex };
      this.filterPersonSuggestions(value);
    });
  }

  closeNotification() {
    this.showNotification = false;
  }

  updateStartTimeValue(i: number, value: string, unit: string): void {
    const clip = this.clips.controls[i];
    switch (unit) {
      case 'hours':
        clip.get('timeCodeStartHours').setValue(value);
        break;
      case 'minutes':
        clip.get('timeCodeStartMinutes').setValue(value);
        break;
      case 'seconds':
        clip.get('timeCodeStartSeconds').setValue(value);
        break;
    }
    this.updateTimeCodeStart(i);
  }

  updateEndTimeValue(i: number, value: string, unit: string): void {
    const clip = this.clips.controls[i];
    switch (unit) {
      case 'hours':
        clip.get('timeCodeEndHours').setValue(value);
        break;
      case 'minutes':
        clip.get('timeCodeEndMinutes').setValue(value);
        break;
      case 'seconds':
        clip.get('timeCodeEndSeconds').setValue(value);
        break;
    }
    this.updateTimeCodeEnd(i);
  }

  updateTimeCodeStart(i: number): void {
    const clip = this.clips.controls[i];
    const hours = clip.get('timeCodeStartHours').value;
    const minutes = clip.get('timeCodeStartMinutes').value;
    const seconds = clip.get('timeCodeStartSeconds').value;
    clip.get('timeCodeStart').setValue(`${hours}:${minutes}:${seconds}`);
  }

  updateTimeCodeEnd(i: number): void {
    const clip = this.clips.controls[i];
    const hours = clip.get('timeCodeEndHours').value;
    const minutes = clip.get('timeCodeEndMinutes').value;
    const seconds = clip.get('timeCodeEndSeconds').value;
    clip.get('timeCodeEnd').setValue(`${hours}:${minutes}:${seconds}`);
  }

  getNumberOptions(limit: number): string[] {
    return Array.from({ length: limit }, (_, i) =>
      i.toString().padStart(2, '0'),
    );
  }

  isValidSeconds(value: string): boolean {
    const numericValue = +value;
    return !isNaN(numericValue) && numericValue >= 0 && numericValue <= 59;
  }

  isValidMinutes(value: string): boolean {
    const numericValue = +value;
    return !isNaN(numericValue) && numericValue >= 0 && numericValue <= 59;
  }

  isValidHours(value: string): boolean {
    const numericValue = +value;
    return !isNaN(numericValue) && numericValue >= 0 && numericValue <= 59;
  }

  showClipConfirmationDialog(index: number) {
    this.clipToDeleteIndex = index;
    this.isClipDialogVisible = true;
  }

  clipConfirmDelete() {
    if (this.clipToDeleteIndex !== null) {
      this.clips.removeAt(this.clipToDeleteIndex);
      this.clipToDeleteIndex = null;
    }
    this.isClipDialogVisible = false;
  }

  clipCancelDelete() {
    this.clipToDeleteIndex = null;
    this.isClipDialogVisible = false;
  }

  showPersonConfirmationDialog(clipIndex: number, personIndex: number) {
    this.personClipIndex = clipIndex;
    this.personToDeleteIndex = personIndex;
    this.isPersonDialogVisible = true;
  }

  personConfirmDelete() {
    if (this.personClipIndex !== null && this.personToDeleteIndex !== null) {
      const personsArray = this.clips
        .at(this.personClipIndex)
        .get('persons') as FormArray;
      personsArray.removeAt(this.personToDeleteIndex);
      this.personToDeleteIndex = null;
      this.personClipIndex = null;
    }
    this.isPersonDialogVisible = false;
  }

  personCancelDelete() {
    this.personToDeleteIndex = null;
    this.personClipIndex = null;
    this.isPersonDialogVisible = false;
  }

  getPersonPhotoUrl(file: File): any {
    if (file instanceof File) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    return this.sanitizer.bypassSecurityTrustUrl(file);
  }

  handleFileInput(event: Event, clipIndex: number, personIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const person = (this.clips.at(clipIndex).get('persons') as FormArray).at(
        personIndex,
      );
      person.patchValue({ personPhoto: file });
    }
  }

  getPersonPhotoData(personPhoto: any): any {
    if (personPhoto instanceof File) {
      return {
        name: personPhoto.name,
        size: personPhoto.size,
        type: personPhoto.type,
        lastModified: personPhoto.lastModified,
        path: personPhoto.webkitRelativePath,
      };
    } else {
      return null;
    }
  }

  trimFormValuesRecursive(obj: any, exceptions: string[] = []): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.trimFormValuesRecursive(item, exceptions));
    } else if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (exceptions.includes(key)) {
            newObj[key] = obj[key];
          } else if (key === 'persons' && Array.isArray(obj[key])) {
            newObj[key] = obj[key].map((person: any) => ({
              ...person,
              personPhoto: person.personPhoto
                ? this.getPersonPhotoData(person.personPhoto)
                : null,
            }));
          } else {
            newObj[key] = this.trimFormValuesRecursive(obj[key], exceptions);
          }
        }
      }
      return newObj;
    } else if (typeof obj === 'string') {
      return obj.trim();
    }
    return obj;
  }

  fetchDefaultVideoData(): void {
    this.videoService.getDefaultVideoData().subscribe({
      next: (data) => {
        console.log(data);

        if (data.status != 'done') {
          this.videoData = {
            videoId: data.video.id,
            videoLink: data.video.aws_url,
            videoCode: data.video.key,
            videoDuration: data.video.duration,
            userId: data.user_id,
          };

          // this.addresses = data.addresses.map((item: any) => item.address);
          this.countries = data.countries.map((item: any) => item.country);
          this.events = data.events.map((item: any) => item.type_name);
          this.persons = data.persons.map((item: any) => item);

          this.tasksDataService.fetchTasksStatus();
          this.sheetComponent.fetchClips();
        }
        this.notificationMessage = data.message;
        this.notificationStatus = data.status;
        this.showNotification = true;
      },
      error: (error) => {
        console.error('Error fetching default video data:', error);
      },
    });
  }

  getNewVideoData() {
    this.videoService.getDefaultVideoData().subscribe(
      (data) => {
        const status = data.status;
        if (status != 'done') {
          const newVideoData = {
            videoId: data.video.id,
            videoLink: data.video.aws_url,
            videoCode: data.video.key,
            videoDuration: data.video.duration,
            userId: data.user_id,
          };

          this.videoData.videoLink = newVideoData.videoLink;
          this.videoData.videoDuration = newVideoData.videoDuration;
          this.videoData.videoId = newVideoData.videoId;
          this.videoData.videoCode = newVideoData.videoCode;
          this.videoData.userId = newVideoData.userId;

          // this.addresses = data.address.map((item: any) => item.address);
          this.countries = data.countries.map((item: any) => item.country);
          this.persons = data.persons.map((item: any) => item);
          this.events = data.events.map((item: any) => item.event);

          this.sheetComponent.fetchClips();
        }
      },
      (error) => {
        console.error('Error fetching default video data:', error);
      },
    );
  }

  resetForm(): void {
    this.videoForm.reset();
    this.clips.clear();
    this.expandedClips = [];
    this.addClip(true);
    this.resetSelectElements();

    this.videoData = {
      videoId: '',
      videoLink: '',
      videoCode: '',
      videoDuration: '',
      userId: '',
    };
  }

  onSubmit(): void {
    if (this.videoForm.valid) {
      this.loading = true;
      const formData = new FormData();

      formData.append(
        'data',
        this.trimFormValuesRecursive(JSON.stringify(this.videoForm.value)),
      );

      this.clips.controls.forEach((clip, clipIndex) => {
        const persons = clip.get('persons') as FormArray;
        persons.controls.forEach((person, personIndex) => {
          const personPhoto = person.get('personPhoto').value;
          if (personPhoto instanceof File) {
            formData.append(
              `files[${clipIndex}][${personIndex}]`,
              personPhoto,
              personPhoto.name,
            );
          }
        });
      });

      formData.append('videoId', this.videoData.videoId);
      formData.append('videoCode', this.videoData.videoCode);
      formData.append('videoDuration', this.videoData.videoDuration);
      formData.append('userId', this.videoData.userId);
      formData.append('clipsCount', String(this.clips.length));

      this.logFormData(formData);

      this.videoService.postData(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.nextVideoData = response;

          console.log(this.nextVideoData);

          const status = this.nextVideoData.status;

          this.notificationStatus = status;
          this.showNotification = true;
          if (status == 'error') {
            this.notificationMessage = this.nextVideoData.errors;
          } else {
            this.notificationMessage = this.nextVideoData.message;

            this.resetForm();

            if (this.nextVideoData) {
              this.getNewVideoData();
            }

            if (this.sheetComponent) {
              this.sheetComponent.clearData();
            }
          }
          window.scrollTo(0, 0);

          this.tasksDataService.fetchTasksStatus();

          this.showCountrySuggestions = false;
          // this.showAddressSuggestions = false;
          this.showPersonSuggestions = false;
          this.showEventTypeSuggestions = false;
        },
        error: (error) => {
          this.loading = false;
          console.error('Error sending data:', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  logFormData(formData: FormData): void {
    console.log('FormData Contents:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(
          // `Key: ${key}, File Name: ${value.name}, Size: ${value.size} bytes, Type: ${value.type}`,
          value,
        );
      } else {
        console.log(`Key: ${key}, Value: ${value}`);
      }
    });
  }

  resetSelectElements(): void {
    const setOrCreateOption = (
      select: HTMLSelectElement,
      value: string,
      text: string,
    ) => {
      let option = select.querySelector(
        `option[value="${value}"]`,
      ) as HTMLOptionElement;
      if (!option) {
        option = document.createElement('option');
        option.value = value;
        option.text = text;
        select.appendChild(option);
      }
      select.value = value;
      select.dispatchEvent(new Event('change'));
    };

    const hourSelects = document.querySelectorAll('select.hours');
    hourSelects.forEach((select) => {
      setOrCreateOption(select as HTMLSelectElement, '00', 'الساعة');
    });

    const minuteSelects = document.querySelectorAll('select.minutes');
    minuteSelects.forEach((select) => {
      setOrCreateOption(select as HTMLSelectElement, '', 'الدقيقة');
    });

    const secondSelects = document.querySelectorAll('select.seconds');
    secondSelects.forEach((select) => {
      setOrCreateOption(select as HTMLSelectElement, '', 'الثانية');
    });
  }

  getCsrfToken(): string | null {
    const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
    return tokenMetaTag ? tokenMetaTag.getAttribute('content') : null;
  }
}
