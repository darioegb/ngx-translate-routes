import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ProfileComponent } from '../profile/profile.component'
import { ListusersComponent } from '../listusers/listusers.component'

const routes: Routes = [
  {
    path: '',
    title: 'users.root',
    children: [
      {
        path: 'profile/:userId',
        component: ProfileComponent,
        data: {
          title: 'users.profile',
        },
      },
      {
        path: 'myAccount',
        component: ListusersComponent,
        data: {
          title: 'users.myAccount',
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
