import { Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';

import { ErrorComponent } from '../error/error.component';
import { NodeContainerComponent } from 'app/node/node-container.component';
import { NodeEditComponent } from 'app/node/node-edit.component';
import { TreeStructureComponent } from 'app/tree-structure/tree-structure.component';
import { ProjectDashboardComponent } from 'app/project/project-dashboard.component';
import { TeamDashboardComponent } from 'app/team/team-dashboard.component';
import { ChatComponent } from 'app/chat/chat.component';
import { TasksComponent } from 'app/tasks/tasks.component';
import { ScrumboardComponent } from 'app/scrumboard/scrumboard.component';
import { DocumentsListComponent } from 'app/documents/documents-list.component';
import { PermissionsComponent } from 'app/permissions/permissions.component';

export const routes: Routes = [
    {
        path: 'node',
        canActivate: [ AuthGuard ],
        children: [
            {
                path: ':type/:id',
                component: NodeContainerComponent,
                children: [
                    {
                        path: 'details', 
                        component: NodeEditComponent,
                    },
                    {
                        path: 'tree', 
                        component: TreeStructureComponent,
                    },
                    {
                        path: 'projectDashboard', 
                        component: ProjectDashboardComponent,
                    },
                    {
                        path: 'teamDashboard', 
                        component: TeamDashboardComponent,
                    },
                    {
                        path: 'chat', 
                        component: ChatComponent,
                    },
                    {
                        path: 'tasks', 
                        component: TasksComponent,
                    },
                    {
                        path: 'scrumboard', 
                        component: ScrumboardComponent,
                    },
                    {
                        path: 'documents', 
                        component: DocumentsListComponent,
                    },
                    {
                        path: 'permissions', 
                        component: PermissionsComponent,
                    }
                ]
            }
        ]
    },
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: '**', component: ErrorComponent },
]
