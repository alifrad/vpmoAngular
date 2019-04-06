import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector     : 'scrumboard-edit-list-name',
    templateUrl  : './edit-list-name.component.html',
    styleUrls    : ['./edit-list-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardEditListNameComponent
{
    formActive: boolean;
    form: FormGroup;

    @Input()
    list;

    @Output()
    listNameChanged: EventEmitter<any>;

    @ViewChild('nameInput')
    nameInputField;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.formActive = false;
        this.listNameChanged = new EventEmitter();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the form
     */
    openForm(): void
    {
        this.form = this._formBuilder.group({
            title: [this.list.title]
        });
        this.formActive = true;
        this.focusNameField();
    }

    /**
     * Close the form
     */
    closeForm(): void
    {
        this.formActive = false;
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

            this.list.title = this.form.getRawValue().title;
            this.listNameChanged.next(this.list.title);
            this.formActive = false;
        }
    }
}
