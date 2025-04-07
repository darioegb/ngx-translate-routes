import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AboutComponent } from './about/about.component'
import { MyprofileComponent } from './myprofile/myprofile.component'
import { MyaccountComponent } from './myaccount/myaccount.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { NotFoundComponent } from './not-found/not-found.component'

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
