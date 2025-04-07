import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class AboutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)

  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.activatedRoute.queryParams)
    console.log(params)
  }
}
