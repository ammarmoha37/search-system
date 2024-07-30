import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '@services/users.service';

interface DropdownOption {
  code: string;
  flag?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  successMessage: string | null = null;
  // selectedPhoto: File | null = null;

  userData: any = {
    userId: '',
    name: '',
    email: '',
    phone: '',
    photo: '',
  };

  options: DropdownOption[] = [
    { code: '+90', flag: 'assets/turkey.svg' },
    { code: '+20', flag: 'assets/egypt.svg' },
    { code: '+974', flag: 'assets/qatar.svg' },
    { code: '+1', flag: 'assets/USA.svg' },
  ];

  selectedOption: DropdownOption | null = {
    code: '+90',
    flag: 'assets/turkey.svg',
  };
  isDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    // Initialize profileForm with FormBuilder
    this.profileForm = this.fb.group({
      name: ['', Validators.required], // Example validation
      email: ['', [Validators.required, Validators.email]], // Example validation
      phone: ['', Validators.required], // Example validation
      password: ['', [Validators.minLength(8)]],
    });

    this.fetchDefaultUserData();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: DropdownOption) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  // onPhotoSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.selectedPhoto = file;

  //     // Read file contents for preview
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedPhoto = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  fetchDefaultUserData(): void {
    this.usersService.getDefaultUserData().subscribe({
      next: (data) => {
        console.log(data);

        this.userData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
        };

        this.profileForm.patchValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: '',
        });
      },
      error: (error) => {
        console.error('Error fetching default video data:', error);
      },
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;

      this.usersService.userEditInfo(formData).subscribe({
        next: (response) => {
          console.log('Data sent successfully:', response);
          this.userData = {
            ...this.userData,
            ...formData,
          };
          this.profileForm.patchValue({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: '',
          });
          this.successMessage = 'تم تحديث البيانات بنجاح!';
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);
        },
        error: (error) => {
          console.error('Error sending data:', error);
        },
      });
    }
  }

  getCsrfToken(): string | null {
    const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
    return tokenMetaTag ? tokenMetaTag.getAttribute('content') : null;
  }
}
