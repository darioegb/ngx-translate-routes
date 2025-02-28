import { Location } from '@angular/common'
import { Component, inject } from '@angular/core'

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
})
export class MyaccountComponent {
  private readonly location = inject(Location)

  goBack(): void {
    this.location.back()
  }
}
