import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class DashboardComponent {}
