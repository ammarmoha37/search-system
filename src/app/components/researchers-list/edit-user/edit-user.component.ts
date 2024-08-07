import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDashboardService } from '@services/admin-dashboard.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  @Input() selectedUserId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userEdited = new EventEmitter<void>();

  editUserForm: FormGroup;
  passwordFieldType = 'password';
  errorMessage: string = '';
  showConfirmation = false;
  confirmationData: any = {};

  constructor(
    private fb: FormBuilder,
    private adminService: AdminDashboardService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.close.emit();
      }
    });

    if (this.selectedUserId) {
      this.fetchUserData();
    }
  }

  fetchUserData(): void {
    this.adminService.getAllResearchers().subscribe({
      next: (users) => {
        const user = users.find((u: any) => u.id === this.selectedUserId);
        console.log(user);

        this.editUserForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: '',
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch user data';
      },
    });
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      const formData = {
        ...this.editUserForm.value,
        user_id: this.selectedUserId,
      };

      this.adminService.userEditInfo(formData).subscribe({
        next: (response) => {
          console.log('Data sent successfully:', response);
          this.close.emit();
          this.userEdited.emit();
        },
        error: (error) => {
          console.error('Error sending data:', error);
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onClickInside(event: MouseEvent): void {
    event.stopPropagation();
  }
}
