import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const name = params['name']
      console.log(name)
    })
  }
}
