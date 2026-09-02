import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ListusersComponent {}
