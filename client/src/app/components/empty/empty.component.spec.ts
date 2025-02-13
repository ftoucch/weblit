import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyComponent } from './empty.component';

describe('EmptyComponent', () => {
  let component: EmptyComponent;
  let fixture: ComponentFixture<EmptyComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
