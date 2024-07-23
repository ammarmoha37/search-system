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
  selectedPhoto: File | null = null;

  userData: any = {
    userId: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
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
      personName: ['', Validators.required], // Example validation
      emailAddress: ['', [Validators.required, Validators.email]], // Example validation
      phoneNumber: ['', Validators.required], // Example validation
      gender: ['أختر الجنس', Validators.required], // Example selection
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

  onPhotoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;

      // Read file contents for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  fetchDefaultUserData(): void {
    this.usersService.getDefaultUserData().subscribe(
      (data) => {
        console.log(data);

        this.userData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          photo: data.photo,
        };

        this.profileForm.patchValue({
          personName: data.name,
          emailAddress: data.email,
          phoneNumber: data.phone,
          gender: data.gender,
        });
      },
      (error) => {
        console.error('Error fetching default video data:', error);
      },
    );
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = {
        personName: this.profileForm.value.personName,
        emailAddress: this.profileForm.value.emailAddress,
        phoneNumber: this.profileForm.value.phoneNumber,
        gender: this.profileForm.value.gender,
      };

      console.log(formData);

      this.usersService.postData(formData).subscribe({
        next: (response) => {
          console.log('Data sent successfully:', response);
          // Handle successful response (e.g., display success message)
        },
        error: (error) => {
          console.error('Error sending data:', error);
          // Handle error (e.g., display error message)
        },
      });
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }

  getCsrfToken(): string | null {
    const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
    return tokenMetaTag ? tokenMetaTag.getAttribute('content') : null;
  }
}
