// Import bugsnag-js and bugsnag-angular
import BugsnagErrorHandler from 'bugsnag-angular';
import bugsnag from 'bugsnag-js';

import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSampleModule } from './main/content/sample/sample.module';

import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TasksModule } from './tasks/tasks.module';
import { DocumentsModule } from './documents/documents.module';
import { NodeBreadcrumbsModule } from './node-breadcrumbs/node-breadcrumbs.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './shared/app.routing';
import { MessageService } from './shared/message.service';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './_services/alert.service';
import { LoadingService } from './_services/loading.service';
import { LoadingComponent } from './_directives/loading.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { HttpCacheService } from './_services/http-cache.service';
import { CacheInterceptor } from './_services/cache.interceptor';
import { appConfig } from './app.config';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { ReactiveFormsModule } from '@angular/forms';
import { TeamModule } from './team/team.module';
import { NodeModule } from './node/node.module';
import { TreeStructureModule } from './tree-structure/tree-structure.module';
import {
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  } from '@angular/material';
import { GlobalService } from './_services/global.service';
import { NavigationComponent } from './navigation/navigation.component';

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
    // Other modules whose exported classes are needed 
    // by component templates declared in this NgModule 
      imports     : [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Fuse Main and Shared modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseMainModule,
        FuseSampleModule,
        TeamModule,
        UserModule,
        ProjectModule,
        ChatModule,
        PermissionsModule,
        TasksModule,
        DocumentsModule,
        NodeBreadcrumbsModule,
        TreeStructureModule,
        NodeModule,
        MatProgressSpinnerModule
    ],
    // The components, directives, and pipes that belong to this NgModule
    declarations: [
        AppComponent,
        HomeComponent,
        ErrorComponent,
        AlertComponent,
        LoadingComponent,
        NavigationComponent,

    ],
    // The main application view, called the root component, which hosts all other app views
    // Only the root NgModule should set the bootstrap property
    bootstrap   : [
        AppComponent,
        
    ],
    // The subset of declarations that should be visible and 
    // usable in the component templatesof other NgModules
    exports: [
        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    // Creators of services that this NgModule contributes to the global
    // collection of services; they become accessible in all parts of the app
    providers: [
        MessageService,
        AuthenticationService,
        GlobalService,
        AuthGuard,
        AlertService,
        LoadingService,
        HttpCacheService,
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor , multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor , multi: true }
      ],
    
})
export class AppModule
{
}
