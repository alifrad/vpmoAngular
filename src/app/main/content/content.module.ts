import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseContentComponent } from 'app/main/content/content.component';
import { MatButtonModule, MatIconModule } from '@angular/material';



@NgModule({
    declarations: [
        FuseContentComponent
    ],
    imports     : [
        RouterModule,

        FuseSharedModule,

        MatButtonModule,
        MatIconModule

    ],
    exports: [
        FuseContentComponent
    ]
})
export class FuseContentModule
{
}
