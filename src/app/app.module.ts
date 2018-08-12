// Import bugsnag-js and bugsnag-angular
import BugsnagErrorHandler from 'bugsnag-angular';
import bugsnag from 'bugsnag-js';

import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JwtModule } from '@auth0/angular-jwt';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSampleModule } from './main/content/sample/sample.module';

import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './shared/app.routing';
import { MessageService } from './shared/message.service';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { HttpCacheService } from './_services/http-cache.service';
import { CacheInterceptor } from './_services/cache.interceptor';
import { appConfig } from './app.config';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TeamsComponent } from './team/teams.component';


const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'sample'
    }
];

const tempUser = null;

// configure Bugsnag ASAP, before any other imports
const bugsnagClient = bugsnag('API_KEY');

// https://stackblitz.com/angular/krgrvqvrapa?file=styles.css
// create a factory which will return the bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler(bugsnagClient);
}



export function tokenGetter() {
    this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.tempUser.token);
    return this.tempUser.token;
}


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ErrorComponent,
        AlertComponent,
        TeamsComponent
    ],
    imports     : [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Fuse Main and Shared modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseMainModule,
        FuseSampleModule,
        
        UserModule,
        ProjectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        // add the token to the headers of the requsts to backend
        JwtModule.forRoot({
            config: {
              tokenGetter: tokenGetter,
              throwNoTokenError: false,
              skipWhenExpired: false,
              whitelistedDomains: [appConfig.apiUrl],
              blacklistedRoutes: [appConfig.apiAuthUrl + '/users/login'],
              authScheme: 'JWT '
            }
          }),

    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        MessageService,
        AuthenticationService,
        AlertService,
        HttpCacheService,
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
      ],
})
export class AppModule
{
}
