import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormComponent } from './review-form.component';

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
