import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule } from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { NodeBreadcrumbsComponent } from './node-breadcrumbs.component';
// import { NodeBreadcrumbsService } from './node-breadcrumbs.service';

const NodeBreadcrumbsRoutes: Routes = [
  {
    path: ':type/:id',
    component: NodeBreadcrumbsComponent,
    canActivate: [ AuthGuard ]
  }
];
@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(NodeBreadcrumbsRoutes),
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [
    NodeBreadcrumbsComponent
  ],
  providers: [
  	// NodeBreadcrumbsService
  ],
  exports: [
    NodeBreadcrumbsComponent
  ],
  bootstrap: [NodeBreadcrumbsComponent],
  entryComponents: []
})
export class NodeBreadcrumbsModule { }