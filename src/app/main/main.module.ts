import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseNavigationModule, FuseSearchBarModule, FuseShortcutsModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseContentModule } from 'app/main/content/content.module';
import { FuseFooterModule } from 'app/main/footer/footer.module';
import { NavbarModule } from 'app/main/navbar/navbar.module';
import { FuseQuickPanelModule } from 'app/main/quick-panel/quick-panel.module';
import { FuseToolbarModule } from 'app/main/toolbar/toolbar.module';
import { FuseMainComponent } from './main.component';
import { TopicPanelModule } from './topic-panel/topic-panel.module';

@NgModule({
    
    imports     : [
        RouterModule,

        MatSidenavModule,

        FuseSharedModule,
        FuseThemeOptionsModule,
        FuseNavigationModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        FuseSidebarModule,
        FuseContentModule,
        FuseFooterModule,
        NavbarModule,
        FuseQuickPanelModule,
        FuseToolbarModule,
        TopicPanelModule
    ],

    declarations: [
        FuseMainComponent,
        
    ],
    bootstrap: [],
    exports     : [
        FuseMainComponent
    ]
})
export class FuseMainModule
{
}
