import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatCardModule, MatListModule } from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { PermissionsComponent } from './permissions.component';


const PermissionsRoutes: Routes = [
  {
    path: 'permissions',
    component: PermissionsComponent
  }
];
@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(PermissionsRoutes),
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
  ],
  declarations: [
    PermissionsComponent,
  ],
  providers: [
  ],
  exports: [
    PermissionsComponent,
  ],
  bootstrap: [PermissionsComponent]
})
export class PermissionsModule { }