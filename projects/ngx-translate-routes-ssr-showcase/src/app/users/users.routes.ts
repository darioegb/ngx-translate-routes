import { Routes } from '@angular/router'
import { ListusersComponent } from '../listusers/listusers.component'
import { ProfileComponent } from '../profile/profile.component'

export const usersRoutes: Routes = [
  { path: '', title: 'users.root', children: [] },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    data: {
      title: 'users.profile',
    },
  },
  {
    path: 'myaccount',
    component: ListusersComponent,
    data: {
      title: 'users.myaccount',
    },
  },
]
