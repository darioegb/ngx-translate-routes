import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';
import { ListusersComponent } from '../listusers/listusers.component';

const routes: Routes = [
  { path: '', data: {title: 'titles.users.root'} },
  { path: 'profile/:id', component: ProfileComponent, data: {title: 'titles.users.profile'} },
  { path: 'myaccount', component: ListusersComponent, data: {title: 'titles.users.myaccount'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsersRoutingModule { }
