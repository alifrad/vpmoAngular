import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { AuthenticationService } from 'app/_services/authentication.service';
import { GlobalService } from '../../_services/global2.service';
import { Observable } from 'rxjs';


@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit {
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;
    navigation: any;
    title = 'app';
    isLoggedIn: boolean;
    user: any;
    fullname: any;


    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private sidebarService: FuseSidebarService,
        private translate: TranslateService,
        private authService: AuthenticationService,
        private globalService: GlobalService,
    )
    {
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'tr',
                'title': 'Turkish',
                'flag' : 'tr'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onConfigChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
            this.noNav = settings.layout.navigation === 'non e';
        });

        this.navigation = navigation;

        this.globalService.currentUserValue.subscribe(
            (user) => {
                this.user = user;
                this.user = JSON.parse(this.user);
                this.fullname = this.user.token;            
            },
            (err: any) => console.log(err),
        );


    }

    ngOnInit() {
        // debugger;

        this.authService.getUserName()
            .subscribe(
                (data: string) => {
                    this.fullname = data;
                    console.log(`username:' ${this.fullname}`);
                },
                (err: any) => console.log('toolbar oninit: could not retrieve user fullname')

            );

        this.authService.isAuthenticated()
            .subscribe(
                (data: boolean) => { this.isLoggedIn = data, console.log(`isLoggedIn: ${this.isLoggedIn}`); },
                (err: any) => console.log(`error in reading isAuthenticated from Auth component ${err}`),
                () => console.log('isAuthenticated function read properly')
            );
        console.log('ngOnInit complete');

    }

    toggleSidebarOpened(key)
    {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    search(value)
    {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang)
    {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }

    logout() {
        // console.log(this.user$ + ' is loggin out...');
        this.authService.logout();
        
    }

    loggedIn() {
        if (this.authService.isAuthenticated()){
            console.log('user is authenticated'); 
        } else {
            console.log('user is not authenticated'); 
        }
        
        
    }
}
