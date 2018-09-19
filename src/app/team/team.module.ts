import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppModule } from '../app.module';
import { TeamsComponent } from './teams.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const TeamRoutes: Routes = [
    {
        path: 'team',
        // component: UserComponent,
        children: [
            // { path: 'tree', component: SignUpComponent },
            { path: 'all', component: TeamsComponent },
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TeamRoutes),
        
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
