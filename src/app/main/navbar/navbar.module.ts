import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { NavbarComponent } from 'app/main/navbar/navbar.component';
import { NavbarVerticalStyle1Module } from 'app/main/navbar/vertical/style-1/style-1.module';


@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports     : [
        FuseSharedModule,
        NavbarVerticalStyle1Module,
    ],
    exports     : [
        NavbarComponent
    ]
})
export class NavbarModule
{
}
