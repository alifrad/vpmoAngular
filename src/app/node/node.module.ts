import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_guards/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NodepageComponent } from './nodepage.component';
import { HttpClientModule } from '@angular/common/http';
import { 
  MatDatepickerModule, 
  MatNativeDateModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatButtonModule, 
  MatCardModule, 
  MatListModule,
  MatTabsModule,
  MatExpansionModule, 
} from '@angular/material';
import { ProjectEditComponent } from '../project/project-edit.component';
import { ProjectModule } from '../project/project.module';
import { ChatModule } from '../chat/chat.module';
import { TreeStructureModule } from '../tree-structure/tree-structure.module';
import { NodeEditComponent } from './node-edit.component';
import { PermissionsModule } from '../permissions/permissions.module';
import { TasksModule } from '../tasks/tasks.module';
import { NodeBreadcrumbsModule } from '../node-breadcrumbs/node-breadcrumbs.module';
import { DocumentsModule } from '../documents/documents.module';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';

const NodeRoutes: Routes = [
  {
      path: 'node',
      canActivate: [ AuthGuard ],
      children: [
          { path: ':type/:id', component: NodepageComponent },

      ]
  },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(NodeRoutes),
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    ProjectModule,
    ChatModule,
    PermissionsModule,
    TasksModule,
    DocumentsModule,
    TreeStructureModule,
    QuillModule,
    NodeBreadcrumbsModule
  ],
  declarations: [
    NodepageComponent,
    NodeEditComponent,
    

  ],
  exports: [
    NodepageComponent,
    
  ],
})
export class NodeModule { }
