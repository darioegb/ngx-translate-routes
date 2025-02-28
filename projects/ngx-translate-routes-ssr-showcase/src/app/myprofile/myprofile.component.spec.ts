import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { MyprofileComponent } from './myprofile.component'

describe('MyprofileComponent', () => {
  let component: MyprofileComponent
  let fixture: ComponentFixture<MyprofileComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MyprofileComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MyprofileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
