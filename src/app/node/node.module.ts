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
  MatSelectModule, 
  MatDividerModule,
  MatBadgeModule,
} from '@angular/material';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { ChatModule } from '../chat/chat.module';
import { TreeStructureModule } from '../tree-structure/tree-structure.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { TasksModule } from '../tasks/tasks.module';
import { NodeBreadcrumbsModule } from '../node-breadcrumbs/node-breadcrumbs.module';
import { DocumentsModule } from '../documents/documents.module';
import { TeamModule } from '../team/team.module';
import { ScrumboardModule } from '../scrumboard/scrumboard.module';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { NodeService } from './node.service';
import { NodeNavigationService } from './node-navigation.service';
import { NodeEditComponent } from './node-edit.component';
import { NodeContainerComponent } from './node-container.component';
import { NodeShortcutsComponent } from './node-shortcuts.component';
import { RouterTabModule } from 'app/navigation/router-tab.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
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
    MatDividerModule,
    MatBadgeModule,
    ProjectModule,
    ChatModule,
    PermissionsModule,
    TasksModule,
    DocumentsModule,
    TreeStructureModule,
    QuillModule,
    NodeBreadcrumbsModule,
    UserModule,
    ScrumboardModule,
    TeamModule,
    RouterTabModule
  ],
  providers: [
    NodeService,
    NodeNavigationService,
  ],
  declarations: [
    NodepageComponent,
    NodeEditComponent,
    NodeContainerComponent,
    NodeShortcutsComponent
    
  ],
  exports: [
    NodepageComponent,
    NodeEditComponent,
    NodeContainerComponent
  ],
})
export class NodeModule { }
