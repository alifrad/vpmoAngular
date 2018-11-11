import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { ProjectAddComponent } from './project-add.component';
import { ProjectService } from './project.service';
import { ProjectComponent } from './project.component';
import { 
  MatDatepickerModule, 
  MatNativeDateModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatButtonModule, 
  MatCardModule, 
  MatListModule 
} from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { ProjectListComponent } from './project-list.component';
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
    QuillModule,
    
  ],
  declarations: [
    ProjectComponent,
    ProjectAddComponent,
    ProjectListComponent
  ],
  providers: [
    ProjectService,
  ],
  exports: [
  ],
})
export class ProjectModule { }

// platformBrowserDynamic().bootstrapModule(ProjectModule);
