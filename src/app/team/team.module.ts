import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppModule } from '../app.module';
import { TeamsComponent } from './teams.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  } from '@angular/material';

const TeamRoutes: Routes = [
    {
        path: 'team',
        // component: UserComponent,
        children: [
            // { path: 'tree', component: SignUpComponent },
            { path: 'all', component: TeamsComponent },
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
        MatInputModule
    ],
    exports: [
        TeamsComponent,
        
    ],
    declarations: [
        TeamsComponent,
        
    ],
    providers: [
        

    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export class TeamModule {}

