import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaccountComponent } from './myaccount.component';

describe('MyaccountComponent', () => {
  let component: MyaccountComponent;
  let fixture: ComponentFixture<MyaccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
