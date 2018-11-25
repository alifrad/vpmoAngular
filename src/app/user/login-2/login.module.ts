import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatCardModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from './login.component';

// const routes = [
//     {
//         path     : 'user/login',
//         component: LoginComponent
//     }
// ];

@NgModule({
    imports     : [
        RouterModule,
        
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
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
