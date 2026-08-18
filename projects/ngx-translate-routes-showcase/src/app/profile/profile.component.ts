import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileComponent {}
