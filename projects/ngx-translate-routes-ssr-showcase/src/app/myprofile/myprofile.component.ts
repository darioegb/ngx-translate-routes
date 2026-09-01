import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-myprofile',
  standalone: true,
  templateUrl: './myprofile.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./myprofile.component.scss'],
})
export class MyprofileComponent {}
