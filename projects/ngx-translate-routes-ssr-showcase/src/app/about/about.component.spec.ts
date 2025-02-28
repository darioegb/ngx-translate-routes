import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'

import { AboutComponent } from './about.component'

describe('AboutComponent', () => {
  let component: AboutComponent
  let fixture: ComponentFixture<AboutComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-id' }),
            data: of({}),
            queryParams: of({}),
            fragment: of(''),
            snapshot: {
              paramMap: {
                get: () => 'test-id',
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
