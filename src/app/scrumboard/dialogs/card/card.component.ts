import { Component, Inject, OnDestroy, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms/src/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { Subject } from 'rxjs';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';

import { ScrumboardService } from '../../scrumboard.service';
import { takeUntil } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

import { appConfig } from 'app/app.config';


@Component({
    selector     : 'scrumboard-card-dialog',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardCardDialogComponent implements OnInit, OnDestroy
{
    list: any;
    card: any;
    searchUrl: string;

    toggleInArray = FuseUtils.toggleInArray;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild('checklistMenuTrigger')
    checklistMenu: MatMenuTrigger;

    @ViewChild('newCheckListTitleField')
    newCheckListTitleField;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ScrumboardCardDialogComponent>} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        public matDialogRef: MatDialogRef<ScrumboardCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _matDialog: MatDialog,
        private _scrumboardService: ScrumboardService
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
        this.list = this._data.list
        this.card = this._data.task

        this.searchUrl = `${appConfig.taskApiUrl}` + '/assignable_task_users/' + this._data.nodeID +'/' + '?nodeType='+this._data.nodeType + '&search='
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
     * Add Attachment
     */
    addAttachment(event) {
        var file = event.target.files[0]

        this._scrumboardService.getPresignedS3Url(this.card._id, file.name)
            .pipe(mergeMap(putDetails => {
                return this._scrumboardService.uploadS3Document(putDetails.url, file, file.type)
            }))
            .pipe(mergeMap(awsResponse => {
                return this._scrumboardService.createTaskDocument(this.card._id, file.name)
            }))
            .subscribe(createDocResponse => {
                this.card.documents.push(createDocResponse)
            })
        console.log(event)
    }


    /**
     * Remove attachment - TODO
     *
     * @param attachment
     */
    removeAttachment(document): void
    {
        this._scrumboardService.deleteTaskDocument(this.card._id, document._id)
            .subscribe(response => {
                this.card.documents.splice(this.card.documents.indexOf(document), 1)
            })
    }


    /**
     * Add new comment - TODO
     *
     * @param {NgForm} form
     */
    addNewComment(form: NgForm): void
    {
        const newCommentText = form.value.newComment;

        const newComment = {
            idMember: '36027j1930450d8bf7b10158',
            message : newCommentText,
            time    : 'now'
        };

        this.card.comments.unshift(newComment);

        form.setValue({newComment: ''});

        this.updateCard();
    }

    /**
     * Assignee Changed
     */
    assigneeChanged (e) {
        if (e.filteredUsers && e.filteredUsers.length > 0 && e.selectedUser != this.card.assignee.username) {
            if (e.filteredUsers.map(i => i.username).indexOf(e.selectedUser) >= 0) {
                this.card.assignee = e.selectedUser
                console.log(e)
                this.updateCard()
            } 
        }
    }

    /**
     * Remove card
     */
    removeCard(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the card?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.matDialogRef.close();
                this._scrumboardService.removeCard(this.card._id, this.list._id);
            }
        });
    }

    /**
     * Update card
     */
    updateCard(): void
    {
        this._scrumboardService.updateCard(this.card, this.list._id);
    }
}
