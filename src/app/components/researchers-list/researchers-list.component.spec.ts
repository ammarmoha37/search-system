import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchersListComponent } from './researchers-list.component';

describe('ResearchersListComponent', () => {
  let component: ResearchersListComponent;
  let fixture: ComponentFixture<ResearchersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearchersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
