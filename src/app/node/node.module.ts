import { NgModule, Component } from '@angular/core';
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
  MatSelectModule 
} from '@angular/material';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { ChatModule } from '../chat/chat.module';
import { TreeStructureModule } from '../tree-structure/tree-structure.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { TasksModule } from '../tasks/tasks.module';
import { NodeBreadcrumbsModule } from '../node-breadcrumbs/node-breadcrumbs.module';
import { DocumentsModule } from '../documents/documents.module';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { NodeService } from './node.service';
import { NodeNavigationService } from './node-navigation.service';
import { NodeEditComponent } from './node-edit.component';
import { DocumentsListComponent } from 'app/documents/documents-list.component';
import { PermissionsComponent } from 'app/permissions/permissions.component';
import { ChatComponent } from 'app/chat/chat.component';
import { TreeStructureComponent } from 'app/tree-structure/tree-structure.component'
import { TasksComponent } from 'app/tasks/tasks.component';
import { NodeContainerComponent } from './node-container.component';

const NodeRoutes: Routes = [
  {
      path: 'node',
      canActivate: [ AuthGuard ],
      children: [
          {
            path: ':id',
            component: NodeContainerComponent,
            pathMatch: 'full'
          },
          // { path: ':type/:id', 
          //   component: NodepageComponent,
          //   outlet: 'breadcrumb'
          // },
          // { path: 'edit/:type/:id', 
          //   component: NodeEditComponent,
          //   outlet: 'content'
          // },
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
    MatSelectModule,
    ProjectModule,
    ChatModule,
    PermissionsModule,
    TasksModule,
    DocumentsModule,
    TreeStructureModule,
    QuillModule,
    NodeBreadcrumbsModule,
    UserModule
  ],
  providers: [
    NodeService,
    NodeNavigationService,
  ],
  declarations: [
    NodepageComponent,
    NodeEditComponent,
    NodeContainerComponent
    
  ],
  exports: [
    NodepageComponent,
    NodeEditComponent,
    NodeContainerComponent
  ],
})
export class NodeModule { }
