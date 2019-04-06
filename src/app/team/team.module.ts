import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppModule } from '../app.module';
import { TeamsListComponent } from './teams-list.component';
import { TeamDashboardComponent } from './team-dashboard.component'
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatModule } from '../chat/chat.module';
import {
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatBadgeModule,
    MatBottomSheetModule
  } from '@angular/material';

const TeamRoutes: Routes = [
    {
        path: 'team',
        // component: UserComponent,
        children: [
            // { path: 'tree', component: SignUpComponent },
            { path: 'all', component: TeamsListComponent },
        ],
        canActivate: [ AuthGuard ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TeamRoutes),

        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatBadgeModule,
        MatBottomSheetModule,

        ChatModule
    ],
    exports: [
        TeamsListComponent,
        TeamDashboardComponent
    ],
    declarations: [
        TeamsListComponent,
        TeamDashboardComponent
    ],
    providers: [

    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export class TeamModule {}

