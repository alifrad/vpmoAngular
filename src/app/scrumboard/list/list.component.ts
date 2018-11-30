import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ScrumboardService } from '../scrumboard.service';
import { ScrumboardCardDialogComponent } from '../dialogs/card/card.component';
import { ScrumboardAddCardComponent } from './add-card/add-card.component';

@Component({
    selector     : 'scrumboard-list',
    templateUrl  : './list.component.html',
    styleUrls    : ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardListComponent implements OnInit, OnDestroy
{
    board: any;
    dialogRef: any;

    @Input()
    list;

    @Input()
    nodeID;

    @Input()
    nodeType;

    @ViewChild(FusePerfectScrollbarDirective)
    listScroll: FusePerfectScrollbarDirective;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {ScrumboardService} _scrumboardService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _scrumboardService: ScrumboardService,
        private _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        /*
        this._scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(board => {
                this.board = board;
            });
        */
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On list name changed
     *
     * @param newListName
     */
    onListNameChanged(newListName): void
    {
        this._scrumboardService.listChanged(this.list._id, {title: newListName})
            .subscribe(response => {
                this.list.title = response.title
            })
    }

    /**
     * On card added
     *
     * @param newCardName
     */
    onCardAdd(newCardData): void
    {
        if ( newCardData.title === '' )
        {
            return;
        }
        var data = {
            task_list_id: this.list._id,
            title: newCardData.title,
            content: newCardData.content,
            assignee: newCardData.assignee,
            due_date: newCardData.due_date,
            status: 'NEW',
            task_list_index: this.list.tasks.length
        }

        this._scrumboardService.addCard(data, this.list._id);

        setTimeout(() => {
            this.listScroll.scrollToBottom(0, 400);
        });
    }

    /**
     * Remove list
     *
     * @param listId
     */
    removeList(listId): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the list and it\'s all cards?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._scrumboardService.removeList(listId);
            }
        });
    }

    /**
        Opens the dialog for task creation
    **/
    openCardCreateDialog() {
        const dialogRef = this._matDialog.open(ScrumboardAddCardComponent, {
            width: '350',
            height: '500',
            data: {nodeID: this.nodeID, nodeType: this.nodeType}
        })

        dialogRef.componentInstance.cardAdded.subscribe(newCardData => {
            this.onCardAdd(newCardData)
        })
    }

    /**
     * Open card dialog
     *
     * @param cardId
     */
    openCardDialog(cardId): void
    {
        this.dialogRef = this._matDialog.open(ScrumboardCardDialogComponent, {
            panelClass: 'scrumboard-card-dialog',
            data      : {
                cardId: cardId,
                listId: this.list.id
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void
    {
        this._scrumboardService.updateTaskIndexes(this.list)
        // this._scrumboardService.updateBoard();
    }
}
