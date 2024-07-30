import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<void>();

  registerForm: FormGroup;
  passwordFieldType = 'password';
  errorMessage: string = '';
  showConfirmation = false;
  selectedUserId: number | null = null;
  confirmationData: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      userType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.close.emit();
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password, userType } = this.registerForm.value;

      this.authService.register(name, email, password, userType).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.confirmationData = {
            name,
            email,
            password,
            userType,
          };
          this.showConfirmation = true;
          this.errorMessage = '';
          this.registerForm.reset();
          this.userAdded.emit();
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
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
