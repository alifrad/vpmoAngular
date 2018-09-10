import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppModule } from '../app.module';
import { TeamsComponent } from './teams.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        AppModule,
        CommonModule
        
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
