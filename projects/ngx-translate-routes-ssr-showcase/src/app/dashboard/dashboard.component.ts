import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
