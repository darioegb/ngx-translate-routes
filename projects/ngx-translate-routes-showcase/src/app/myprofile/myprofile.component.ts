import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class MyprofileComponent {}
