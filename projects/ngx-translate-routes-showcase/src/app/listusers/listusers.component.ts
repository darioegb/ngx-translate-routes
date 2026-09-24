import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class ListusersComponent {}
