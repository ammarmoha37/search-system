import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  currentPage: number = 1;

  // totalPagesArray(): number[] {
  //   const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  //   return Array(totalPages)
  //     .fill(0)
  //     .map((x, i) => i + 1);
  // }

  // onPageChange(page: number) {
  //   this.currentPage = page;
  //   this.pageChange.emit(page);
  // }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  totalPagesArray(): (number | string)[] {
    const totalPages = this.totalPages;
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftEllipsisStart = 3;
      const rightEllipsisStart = totalPages - 2;

      if (this.currentPage <= leftEllipsisStart) {
        pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
      } else if (this.currentPage >= rightEllipsisStart) {
        pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      }
    }

    return pages;
  }

  onPageChange(page: number | string) {
    if (page === '...') {
      if (this.currentPage < this.totalPages - 3) {
        this.currentPage += 1;
      } else {
        this.currentPage -= 1;
      }
    } else {
      this.currentPage = page as number;
    }
    this.pageChange.emit(this.currentPage);
  }
}
