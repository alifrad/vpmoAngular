import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatCardModule,
  MatListModule, MatTableModule, MatDialogModule, MatSelectModule, MatTooltipModule  } from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { DocumentsListComponent } from './documents-list.component';
import { DocumentsService } from './documents.service';


const DocumentsRoutes: Routes = [
  {
    path: 'documents/:type/:id',
    component: DocumentsListComponent,
    canActivate: [ AuthGuard ]
  }
];
@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DocumentsRoutes),
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule
  ],
  declarations: [
    DocumentsListComponent
  ],
  providers: [
    DocumentsService
  ],
  exports: [
    DocumentsListComponent
  ],
  bootstrap: [DocumentsListComponent],
  entryComponents: []
})
export class DocumentsModule { }