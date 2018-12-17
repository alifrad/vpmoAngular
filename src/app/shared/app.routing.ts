import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ErrorComponent } from '../error/error.component';

const ROUTES = [
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: '**', component: ErrorComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
