import { Routes } from '@angular/router'
import { AboutComponent } from './about/about.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { MyaccountComponent } from './myaccount/myaccount.component'
import { MyprofileComponent } from './myprofile/myprofile.component'
import { NotFoundComponent } from './not-found/not-found.component'

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: { skipTranslation: true },
  },
  {
    path: 'aboutAs',
    component: AboutComponent,
    data: {
      title: 'aboutAs',
    },
  },
  {
    path: 'profile',
    component: MyprofileComponent,
    data: {
      title: 'profile',
    },
  },
  {
    path: 'myAccount',
    component: MyaccountComponent,
    data: {
      title: 'myAccount',
    },
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.routes').then((r) => r.usersRoutes),
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { skipTranslation: true },
  },
]
