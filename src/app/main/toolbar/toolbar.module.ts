import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseToolbarComponent } from 'app/main/toolbar/toolbar.component';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { NodeBreadcrumbsModule } from 'app/node-breadcrumbs/node-breadcrumbs.module';
import { NodeBreadcrumbsComponent } from 'app/node-breadcrumbs/node-breadcrumbs.component';

@NgModule({
    declarations: [
        FuseToolbarComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        BrowserModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatToolbarModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,

        NodeBreadcrumbsModule
        
    ],
    bootstrap: [FuseToolbarComponent, NodeBreadcrumbsComponent],
    exports     : [
        FuseToolbarComponent
    ]
})
export class FuseToolbarModule
{
}
