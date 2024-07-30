import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDashboardService } from '@services/admin-dashboard.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-researchers-list',
  templateUrl: './researchers-list.component.html',
  styleUrl: './researchers-list.component.css',
})
export class ResearchersListComponent implements OnInit, OnDestroy {
  researchers: any[] = [];
  paginatedResearchers: any[] = [];
  itemsPerPage: number = 7;
  totalItems: number = 0;
  isRegister: boolean = false;
  isEditingUser: boolean = false;
  searchTerm: string = '';
  selectedUserId: number | null = null;

  constructor(
    private adminService: AdminDashboardService,
    private el: ElementRef,
  ) {
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  ngOnInit() {
    this.fetchResearchersList();

    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  fetchResearchersList() {
    this.adminService.getAllResearchers().subscribe({
      next: (data) => {
        this.researchers = data;
        this.totalItems = data.length;
        this.setPage(1);
        console.log('Videos:', data);
      },
      error: (error) => {
        console.error('Error fetching researchers:', error);
      },
    });
  }

  setPage(page: number) {
    const filteredResearchers = this.researchers.filter((researcher) =>
      researcher.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResearchers = filteredResearchers.slice(startIndex, endIndex);
    this.totalItems = filteredResearchers.length;
  }

  handleOutsideClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (this.isRegister && !this.el.nativeElement.contains(targetElement)) {
      this.isRegister = false;
    }
  }

  onUserAdded() {
    this.fetchResearchersList();
  }

  onUserEdited() {
    this.fetchResearchersList();
  }

  onEditUser(userId: number): void {
    this.selectedUserId = userId;
    this.isEditingUser = true;
  }

  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }

  onSearchChange() {
    this.setPage(1);
  }
}
