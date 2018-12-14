import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { NavbarComponent } from 'app/main/navbar/navbar.component';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { FuseNavigationModule } from '@fuse/components';

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports     : [
    	MatButtonModule,
    	MatIconModule,
        FuseSharedModule,
        FuseNavigationModule
    ],
    exports     : [
        NavbarComponent
    ]
})
export class NavbarModule
{
}
