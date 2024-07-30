import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClippingTasksComponent } from './clipping-tasks.component';

describe('ClippingTasksComponent', () => {
  let component: ClippingTasksComponent;
  let fixture: ComponentFixture<ClippingTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClippingTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClippingTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
