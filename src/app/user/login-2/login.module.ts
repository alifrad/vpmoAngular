import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from './login.component';

const routes = [
    {
        path     : 'user/login',
        component: LoginComponent
    }
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        FuseSharedModule
    ],

    declarations: [
        LoginComponent
    ],
    exports : [
        LoginComponent
    ]

})
export class LoginModule
{
}
