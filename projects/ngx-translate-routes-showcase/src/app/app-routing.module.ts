import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'about', component: AboutComponent, data: {title: 'titles.about'} },
  { path: 'profile', component: MyprofileComponent, data: {title: 'titles.profile'} },
  { path: 'myaccount', component: MyaccountComponent, data: {title: 'titles.myaccount'} },
  { path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'} },
  { path: 'users',  loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
