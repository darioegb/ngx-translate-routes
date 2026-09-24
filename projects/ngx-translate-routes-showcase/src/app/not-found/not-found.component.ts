import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class NotFoundComponent {}
