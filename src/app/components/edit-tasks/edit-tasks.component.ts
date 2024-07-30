import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.component.html',
  styleUrl: './edit-tasks.component.css',
})
export class EditTasksComponent {
  @Input() defaultUserId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() taskEdited = new EventEmitter<void>();
  editTaskForm: FormGroup;
  researchers: any[] = [];
  filteredResearchers: any[] = [];
  availableVideoIds: string[] = [];
  videosNumbersError: string | null = null;
  fromToVideosError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private renderer: Renderer2,
    private adminService: AdminDashboardService,
  ) {
    this.editTaskForm = this.fb.group({
      toUser: ['', Validators.required],
      fromUser: ['', Validators.required],
      taskType: ['multiple', Validators.required],
      to: ['', Validators.required],
      from: ['', Validators.required],
      videosNumbers: ['', Validators.required],
    });

    this.updateValidators(this.editTaskForm.get('taskType')?.value);

    this.editTaskForm.get('taskType')?.valueChanges.subscribe((value) => {
      this.updateValidators(value);
    });

    this.editTaskForm.get('fromUser')?.valueChanges.subscribe((value) => {
      this.fetchAvailableVideoIds(value);
    });
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.close.emit();
      }
    });

    this.adminService.getAdminData().subscribe({
      next: (data) => {
        console.log('Admin data fetched:', data); // Added logging

        this.researchers = data.researchers;
        this.updateFilteredResearchers();

        if (this.defaultUserId) {
          this.editTaskForm.patchValue({
            fromUser: this.defaultUserId,
          });
        }
      },
      error: (error) => {
        console.error('Error fetching researchers', error);
      },
    });

    this.editTaskForm.get('fromUser')?.valueChanges.subscribe(() => {
      this.updateFilteredResearchers();
    });
  }

  updateFilteredResearchers(): void {
    const selectedUserId = this.editTaskForm.get('fromUser')?.value;
    this.filteredResearchers = this.researchers.filter(
      (researcher) => researcher.user_id !== selectedUserId,
    );
  }

  fetchAvailableVideoIds(userId: number): void {

    if (userId) {
      this.adminService.getAvailableTasks(userId).subscribe({
        next: (data) => {
          console.log('Available tasks for user', userId, ':', data); // Added logging

          this.availableVideoIds = Array.isArray(data.available_videos)
            ? data.available_videos
            : [];
          console.log(this.availableVideoIds);
        },
        error: (error) => {
          console.error('Error fetching available video IDs:', error);
        },
      });
    } else {
      this.availableVideoIds = [];
    }
  }

  swapUsers(): void {
    const fromUserValue = this.editTaskForm.get('fromUser')?.value;
    const toUserValue = this.editTaskForm.get('toUser')?.value;

    this.editTaskForm.patchValue({
      fromUser: toUserValue,
      toUser: fromUserValue,
    });

    this.updateFilteredResearchers();
  }

  onSubmit(): void {
    if (this.editTaskForm.valid) {
      const formValue = this.editTaskForm.value;
      let taskData: any;

      if (formValue.taskType === 'multiple') {
        const from = Number(formValue.from);
        const to = Number(formValue.to);

        if (!this.availableVideoIds.length) {
          this.fromToVideosError = 'هذا الباحث ليس لديه فيديوهات للنقل';
          return;
        }

        if (isNaN(from) || isNaN(to) || from >= to) {
          this.fromToVideosError =
            'يجب أن تكون القيمة "من" أقل من القيمة "إلى"';
          return;
        }

        if (
          from < Number(this.availableVideoIds[0]) ||
          to > Number(this.availableVideoIds[this.availableVideoIds.length - 1])
        ) {
          this.fromToVideosError =
            'يجب أن تكون قيم "من" و"إلى" ضمن نطاق مقاطع الفيديو المتاحة.';
          return;
        }

        this.fromToVideosError = null;

        taskData = {
          from: formValue.from,
          to: formValue.to,
          from_user_id: formValue.fromUser,
          to_user_id: formValue.toUser,
          choosen_type: 1,
        };
      } else if (formValue.taskType === 'individual') {
        const videosNumbers = Number(formValue.videosNumbers);

        if (!this.availableVideoIds.length) {
          this.videosNumbersError = 'هذا الباحث ليس لديه فيديوهات للنقل';
          return;
        }

        if (
          isNaN(videosNumbers) ||
          videosNumbers > this.availableVideoIds.length
        ) {
          this.videosNumbersError =
            'عدد مقاطع الفيديو يتجاوز مقاطع الفيديو المتوفرة';
          return;
        } else {
          this.videosNumbersError = null;
        }

        taskData = {
          number: formValue.videosNumbers,
          from_user_id: formValue.fromUser,
          to_user_id: formValue.toUser,
          choosen_type: 0,
        };
      }

      console.log(taskData);
      this.adminService.setTransferredTasks(taskData).subscribe({
        next: (response) => {
          console.log('Task submitted successfully', response);
          this.close.emit();
          this.taskEdited.emit();
        },
        error: (error) => {
          console.error('Error submitting task', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onClickInside(event: MouseEvent): void {
    event.stopPropagation();
  }

  clearInitialValue(controlName: string): void {
    const control = this.editTaskForm.get(controlName);
    if (control?.value === 0) {
      control.setValue('');
    }
  }

  private updateValidators(taskType: string): void {
    if (taskType === 'individual') {
      this.editTaskForm.get('to')?.clearValidators();
      this.editTaskForm.get('from')?.clearValidators();
      this.editTaskForm
        .get('videosNumbers')
        ?.setValidators(Validators.required);
    } else {
      this.editTaskForm.get('to')?.setValidators(Validators.required);
      this.editTaskForm.get('from')?.setValidators(Validators.required);
      this.editTaskForm.get('videosNumbers')?.clearValidators();
    }
    this.editTaskForm.get('to')?.updateValueAndValidity();
    this.editTaskForm.get('from')?.updateValueAndValidity();
    this.editTaskForm.get('videosNumbers')?.updateValueAndValidity();
  }
}
