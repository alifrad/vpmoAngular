import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { ProjectAddComponent } from './project-add.component';
import { ProjectService } from './project.service';
import { ProjectComponent } from './project.component';
import { ProjectDashboardComponent } from './project-dashboard.component'
import { 
  MatDatepickerModule, 
  MatNativeDateModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatButtonModule, 
  MatCardModule, 
  MatListModule,
  MatTableModule
} from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { ProjectListComponent } from './project-list.component';
import { TopicsListComponent } from './topics-list.component'
import { QuillModule } from 'ngx-quill';
import { NodeModule } from '../node/node.module';
// import { MzButtonModule, MzInputModule, MzDatepickerModule } from 'ng2-materialize';

const ProjectRoutes: Routes = [
  {
      path: 'projects',
      
      // component: ProjectComponent,
      children: [
          { path: 'add', component: ProjectAddComponent },
          { path: '', component: ProjectListComponent },
      ],
      canActivate: [ AuthGuard ],
  },
];

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ProjectRoutes),
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
    MatTableModule,
    QuillModule
  ],
  declarations: [
    ProjectComponent,
    ProjectAddComponent,
    ProjectListComponent,
    ProjectDashboardComponent,
    TopicsListComponent
  ],
  providers: [
    ProjectService,
  ],
  exports: [
    ProjectDashboardComponent,
    TopicsListComponent
  ],
})
export class ProjectModule { }

// platformBrowserDynamic().bootstrapModule(ProjectModule);
