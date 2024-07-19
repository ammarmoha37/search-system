import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-submission-notifications',
  templateUrl: './submission-notifications.component.html',
  styleUrl: './submission-notifications.component.css',
})
export class SubmissionNotificationsComponent implements OnInit {
  @Input() message: string[] = [];
  @Input() status: 'error' | 'done' | 'success' | 'login';
  progress = 0;
  intervalId: any;
  isVisible = true;

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.startProgress();
  }

  getTitle(status: string): string {
    switch (status) {
      case 'login':
        return 'المهمة التالية';
      case 'success':
        return ' تم تسجيل البيانات';
      case 'error':
        return 'فشل في تسجيل البيانات';
      case 'done':
        return 'تهانينا';
      default:
        return '';
    }
  }

  startProgress() {
    const duration = 9000;
    const stepTime = 50;
    const stepIncrement = (stepTime / duration) * 100;

    this.intervalId = setInterval(() => {
      if (this.progress < 100) {
        this.progress += stepIncrement;
      } else {
        this.progress = 100;
        clearInterval(this.intervalId);
        this.close.emit();
        this.isVisible = false;
      }
    }, stepTime);
  }

  closeNotification() {
    clearInterval(this.intervalId);
    this.close.emit();
    this.isVisible = false;
  }
}
