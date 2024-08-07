import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledVideosComponent } from './disabled-videos.component';

describe('DisabledVideosComponent', () => {
  let component: DisabledVideosComponent;
  let fixture: ComponentFixture<DisabledVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisabledVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisabledVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
