import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NotFoundComponent {}
