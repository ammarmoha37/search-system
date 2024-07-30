import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDashboardService } from '@services/admin-dashboard.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrl: './add-tasks.component.css',
})
export class AddTasksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() taskAdded = new EventEmitter<void>();
  addTaskForm: FormGroup;
  researchers: any[] = [];
  availableVideoIds: string[] = [];
  videosNumbersError: string | null = null;
  fromToVideosError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private renderer: Renderer2,
    private adminService: AdminDashboardService,
  ) {
    this.addTaskForm = this.fb.group({
      researcher: ['', Validators.required],
      taskType: ['multiple', Validators.required],
      to: ['', Validators.required],
      from: ['', Validators.required],
      videosNumbers: ['', Validators.required],
    });

    this.updateValidators(this.addTaskForm.get('taskType')?.value);

    this.addTaskForm.get('taskType')?.valueChanges.subscribe((value) => {
      this.updateValidators(value);
    });

    this.fetchAvailableVideoIds();
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.close.emit();
      }
    });

    this.adminService.getAdminData().subscribe({
      next: (data) => {
        this.researchers = data.researchers;
      },
      error: (error) => {
        console.error('Error fetching researchers', error);
      },
    });
  }

  fetchAvailableVideoIds(): void {
    this.adminService.getAllAvailableTasks().subscribe({
      next: (data) => {
        console.log(data);
        this.availableVideoIds = Array.isArray(data.videos) ? data.videos : [];
        console.log(this.availableVideoIds);
      },
      error: (error) => {
        console.error('Error fetching available video IDs:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      const formValue = this.addTaskForm.value;
      let taskData: any;

      if (formValue.taskType === 'multiple') {
        const from = Number(formValue.from);
        const to = Number(formValue.to);

        console.log('from submit :', this.availableVideoIds[0]);
        console.log(
          'from submit :',
          this.availableVideoIds[this.availableVideoIds.length - 1],
        );


        if (!this.availableVideoIds.length) {
          this.fromToVideosError = 'لا توجد فيديوهات للتعيين';
          return;
        }

        if (isNaN(from) || isNaN(to) || from >= to) {
          this.fromToVideosError =
            'يجب أن تكون القيمة "من" أقل من القيمة "إلى"';
          return;
        }

        const firstVideoId = Number(this.availableVideoIds[0][0]);
        const lastVideoId = Number(
          this.availableVideoIds[this.availableVideoIds.length - 1][
            this.availableVideoIds[this.availableVideoIds.length - 1].length - 1
          ],
        );

        console.log(firstVideoId);
        console.log(lastVideoId);
        if (from < firstVideoId || to > lastVideoId) {
          console.log(firstVideoId);
          console.log(lastVideoId);

          this.fromToVideosError =
            'يجب أن تكون قيم "من" و"إلى" ضمن نطاق مقاطع الفيديو المتاحة.';
          return;
        }

        this.fromToVideosError = null;

        taskData = {
          from: formValue.from,
          to: formValue.to,
          user_id: formValue.researcher,
          choosen_type: 1,
        };
      } else if (formValue.taskType === 'individual') {
        const videosNumbers = Number(formValue.videosNumbers);

        if (!this.availableVideoIds.length) {
          this.videosNumbersError = 'لا توجد فيديوهات للتعيين';
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
          user_id: formValue.researcher,
          choosen_type: 0,
        };
      }

      console.log(taskData);
      this.adminService.setNewTasks(taskData).subscribe({
        next: (response) => {
          console.log('Task submitted successfully', response);
          this.close.emit();
          this.taskAdded.emit();
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
    const control = this.addTaskForm.get(controlName);
    if (control?.value === 0) {
      control.setValue('');
    }
  }

  private updateValidators(taskType: string): void {
    if (taskType === 'individual') {
      this.addTaskForm.get('to')?.clearValidators();
      this.addTaskForm.get('from')?.clearValidators();
      this.addTaskForm.get('videosNumbers')?.setValidators(Validators.required);
    } else {
      this.addTaskForm.get('to')?.setValidators(Validators.required);
      this.addTaskForm.get('from')?.setValidators(Validators.required);
      this.addTaskForm.get('videosNumbers')?.clearValidators();
    }
    this.addTaskForm.get('to')?.updateValueAndValidity();
    this.addTaskForm.get('from')?.updateValueAndValidity();
    this.addTaskForm.get('videosNumbers')?.updateValueAndValidity();
  }
}
