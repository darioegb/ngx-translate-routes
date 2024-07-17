import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute)

  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.#activatedRoute.queryParams)
    const name = params['name']
    console.log(name)
  }
}
