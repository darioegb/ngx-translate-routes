import { Location } from '@angular/common'
import { Component, inject, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-myaccount',
  standalone: true,
  templateUrl: './myaccount.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./myaccount.component.scss'],
})
export class MyaccountComponent {
  private readonly location = inject(Location)

  goBack(): void {
    this.location.back()
  }
}
