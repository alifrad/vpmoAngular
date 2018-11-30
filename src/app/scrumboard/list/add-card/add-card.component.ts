import { Component, EventEmitter, Output, Input, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appConfig } from 'app/app.config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector     : 'scrumboard-add-card',
    templateUrl  : './add-card.component.html',
    styleUrls    : ['./add-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardAddCardComponent implements OnInit
{
    form: FormGroup;
    nodeID: string;
    nodeType: string;

    @Output()
    cardAdded: EventEmitter<any>;
    

    filteredAssignableUsers: any = [];
    selectedUser: any;
    searchUrl: string;

    @ViewChild('nameInput')
    nameInputField;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ScrumboardAddCardComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    )
    {
        // Set the defaults
        this.cardAdded = new EventEmitter();        
    }

    ngOnInit () {
        this.nodeID = this.data.nodeID
        this.nodeType = this.data.nodeType
        this.searchUrl = `${appConfig.taskApiUrl}` + '/assignable_task_users/' + this.nodeID +'/' + '?nodeType='+this.nodeType + '&search='
        
        this.form = this._formBuilder.group({
            title: '',
            content: '',
            assignee: '',
            due_date: ''
        });
        // TODO: Assignee needs to be created
        this.focusNameField();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    userSelected (e) {
        this.filteredAssignableUsers = e.filteredUsers
        this.selectedUser = e.selectedUser
    }

    /**
     * Close the form
     */
    closeForm(): void
    {
        this.dialogRef.close()
    }

    /**
     * Focus to the name field
     */
    focusNameField(): void
    {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    /**
     * On form submit
     */
    onFormSubmit(): void
    {
        if ( this.form.valid )
        {
            var formData = this.form.getRawValue()
            formData.assignee = this.selectedUser
            this.cardAdded.next(formData);
            this.closeForm()
        }
    }
}

