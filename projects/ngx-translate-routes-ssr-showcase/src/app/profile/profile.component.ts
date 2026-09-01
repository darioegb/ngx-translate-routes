import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {}
