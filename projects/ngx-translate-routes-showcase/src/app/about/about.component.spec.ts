import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'
import { AboutComponent } from './about.component'

describe('AboutComponent', () => {
  let component: AboutComponent
  let fixture: ComponentFixture<AboutComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: () => 'en',
              },
            },
          },
        },
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
