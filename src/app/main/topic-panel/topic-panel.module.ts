import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule, MatTooltipModule, MatToolbarModule, MatRadioModule, MatSelectModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { TopicPanelComponent } from './topic-panel.component';
import { TopicPanelService } from './topic-panel.service';

@NgModule({
    declarations: [
        TopicPanelComponent
    ],
    providers   : [
        TopicPanelService
    ],
    imports     : [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        MatTooltipModule,
        MatRippleModule,
        MatToolbarModule,
        MatRadioModule,
        MatSelectModule,

        FuseSharedModule
    ],
    exports     : [
        TopicPanelComponent
    ]
})
export class TopicPanelModule
{
}
