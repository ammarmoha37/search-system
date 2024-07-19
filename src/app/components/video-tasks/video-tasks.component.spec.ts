import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTasksComponent } from './video-tasks.component';

describe('ResearcherDashboardComponent', () => {
  let component: VideoTasksComponent;
  let fixture: ComponentFixture<VideoTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
