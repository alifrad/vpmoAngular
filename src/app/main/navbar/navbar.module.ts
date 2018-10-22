import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseNavbarComponent } from 'app/main/navbar/navbar.component';
import { FuseNavigationModule } from '@fuse/components';
import { NodeModule } from '../../node/node.module';

@NgModule({
    declarations: [
        FuseNavbarComponent
    ],
    imports     : [
        RouterModule,

        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule,
        NodeModule,
    ],
    exports     : [
        FuseNavbarComponent
    ]
})
export class FuseNavbarModule
{
}
