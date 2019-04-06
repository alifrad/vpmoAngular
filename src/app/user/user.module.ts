import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserSearchComponent } from './user-search.component';
// import { AdminMenuComponent } from './adminMenu/admin-menu.component';
import { LoginModule } from './login-2/login.module';
import { SignUpComponent } from './signUp/sign-up.component';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
import { AuthGuard } from '../_guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './profile/userProfile.component';
import { MatInputModule, MatButtonModule, MatCardModule, MatAutocompleteModule } from '@angular/material';
import { TeamCardComponent } from './dashboard/team-card.component';
import { LoginComponent } from './login-2/login.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TeamModule } from 'app/team/team.module';
import { LogoutComponent } from './logout.component'

const UserRoutes: Routes = [
    {
        path: 'user',
        component: UserComponent,
        children: [
            { 
                path: 'login', 
                component: LoginComponent,         
            },
            { 
                path: 'signup', 
                component: SignUpComponent 
            },
            { 
                path: 'dashboard', 
                component: DashboardComponent,
                canActivate: [ AuthGuard ]
            },
            { 
                path: 'profile', 
                component: UserProfileComponent,
                canActivate: [ AuthGuard ], 
            },
            { 
                path: 'logout', 
                component: LogoutComponent,
                canActivate: [ AuthGuard ], 
            }
            // { path: '', component: AdminMenuComponent, canActivate: [UserService] }
        ]
    },
    {
        path: 'user-search',
        component: UserSearchComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(UserRoutes),
        HttpClientModule,
        LoginModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatAutocompleteModule,
        ImageCropperModule,
        TeamModule
    ],
    exports: [
        SignUpComponent,
        DashboardComponent,
        UserProfileComponent,
        UserSearchComponent
    ],
    declarations: [
        UserComponent,
        SignUpComponent,
        DashboardComponent,
        UserProfileComponent,
        TeamCardComponent,
        UserSearchComponent,
        LogoutComponent
    ],
    providers: [
        UserService,
        AuthGuard,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export class UserModule {}
