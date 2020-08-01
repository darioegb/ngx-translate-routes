import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { ListusersComponent } from '../listusers/listusers.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [ProfileComponent, ListusersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
