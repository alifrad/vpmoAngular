import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatCardModule,
  MatListModule, MatTableModule, MatDialogModule, MatSelectModule, MatTooltipModule,
  MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule } from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { TasksComponent } from './tasks.component';
import { CreateTasksComponent } from './create-tasks.component';
import { TasksService } from './tasks.service';

const TasksRoutes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuard ]
  }
];
@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(TasksRoutes),
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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  declarations: [
    TasksComponent,
    CreateTasksComponent
  ],
  providers: [
  	TasksService
  ],
  exports: [
    TasksComponent,
    CreateTasksComponent
  ],
  bootstrap: [TasksComponent],
  entryComponents: [CreateTasksComponent]
})
export class TasksModule { }