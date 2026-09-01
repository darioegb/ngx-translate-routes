import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DashboardComponent {}
