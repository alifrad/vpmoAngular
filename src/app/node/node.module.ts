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
import { SidebarModule } from '../sidebar/sidebar.module';
import { TopicPanelModule } from "../main/topic-panel/topic-panel.module";


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
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']                                    // remove formatting button

        ]
      }
    }),
    NodeBreadcrumbsModule,
    UserModule,
    ScrumboardModule,
    TeamModule,
    RouterTabModule,
    SidebarModule,
    TopicPanelModule
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
