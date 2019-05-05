import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
    MatProgressBarModule, MatRippleModule, MatSidenavModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { UserModule } from '../user/user.module';

import { BoardResolve, ScrumboardService } from './scrumboard.service';
import { ScrumboardComponent } from './scrumboard.component';
import { ScrumboardListComponent } from './list/list.component';
import { ScrumboardEditListNameComponent } from './list/edit-list-name/edit-list-name.component';
import { ScrumboardAddCardComponent } from './list/add-card/add-card.component';
import { ScrumboardCardComponent } from './list/card/card.component';
import { ScrumboardAddListComponent } from './add-list/add-list.component';
import { ScrumboardCardDialogComponent } from './dialogs/card/card.component';
import { ScrumboardLabelSelectorComponent } from './dialogs/card/label-selector/label-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path     : 'board/:type/:id',
        component: ScrumboardComponent,
        resolve  : {
            scrumboard: ScrumboardService
        }
    }
];

@NgModule({
    declarations: [
        ScrumboardComponent,
        ScrumboardAddListComponent,
        ScrumboardListComponent,
        ScrumboardEditListNameComponent,
        ScrumboardAddCardComponent,
        ScrumboardCardDialogComponent,
        ScrumboardLabelSelectorComponent,
        ScrumboardCardComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,

        NgxDnDModule,
        UserModule,

        DragDropModule
    ],
    providers: [
        ScrumboardService,
        BoardResolve
    ],
    entryComponents: [ScrumboardAddCardComponent, ScrumboardCardDialogComponent],
    exports: [
        ScrumboardComponent,
        ScrumboardCardDialogComponent
    ]
})
export class ScrumboardModule
{
}
