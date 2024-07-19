import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionNotificationsComponent } from './submission-notifications.component';

describe('SubmissionNotificationsComponent', () => {
  let component: SubmissionNotificationsComponent;
  let fixture: ComponentFixture<SubmissionNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmissionNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
