import { Location } from '@angular/common'
import { Component, inject, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MyaccountComponent {
  private readonly location = inject(Location)

  goBack(): void {
    this.location.back()
  }
}
