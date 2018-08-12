import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

import { locale as navigationEnglish } from './navigation/i18n/en';
import { locale as navigationTurkish } from './navigation/i18n/tr';

import { AuthenticationService } from './_services/authentication.service';
import { User } from './user/user';


@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})

export class AppComponent implements OnInit {

    title = 'app';
    fullname: string;
    isLoggedIn: boolean;

    constructor(
        private translate: TranslateService,
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreen: FuseSplashScreenService,
        private fuseTranslationLoader: FuseTranslationLoaderService,
        private authService: AuthenticationService,
        private http: HttpClient,
    )
    {
        // Add languages
        this.translate.addLangs(['en', 'tr']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Set the navigation translations
        this.fuseTranslationLoader.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this.translate.use('en');
    }

    ping() {
        this.http
          .get('http://example.com/api/things')
          .subscribe(data => console.log(data), err => console.log(err));
      }

    ngOnInit() {
        // this.authService.currentUser.subscribe(user => this.fullname = user.fullname);
        // this.authService.userLoggedIn.subscribe(data => this.isLoggedIn = data);
        
          }
}
