import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/_services';

@Component({
    selector     : 'navbar-vertical-style-1',
    templateUrl  : './style-1.component.html',
    styleUrls    : ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    user: any = null;
    isLoggedIn: boolean;
    navigation: any = [ 
        {
        'id'      : 'user',
        'title'   : 'User',
        'type'    : 'group',
        'hidden'  : false,
        'url'  : '',
        'children': [
        {
            'id'   : 'profile',
            'title': 'My Profile',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            'icon' : 'account_circle',
            'url'  : '/user/profile',
            'hidden' : false,
        },
        {
            'id'   : 'logout',
            'title': 'Logout',
            'type' : 'item',
            'icon' : 'exit_to_app',
            'url'  : '/user/logout',
            'hidden' : false,
        },
        {
            'id'   : 'login',
            'title': 'Log in',
            'type' : 'item',
            'icon' : '',
            'url'  : '/user/login',
            'hidden' : true,
        }
        ]},
        {
        'id'      : 'general',
        'title'   : 'General',
        'type'    : 'group',
        'url'  : '',
        'translate': 'NAV.COMPONENTS',
        'children': [
        {
            'id'   : 'home',
            'title': 'Home',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            'icon' : 'home',
            'url'  : '/user/dashboard',
            'hidden' : false,
        },
        {
            'id'   : 'teams',
            'title': 'My Teams',
            'type' : 'item',
            'icon' : 'people',
            'url'  : '/team/all',
            'hidden' : false,
        },
        ]},
        // {
        //     'id'      : 'nodePages',
        //     'title'   : 'Node',
        //     'type'    : 'group',
        //     'hidden' : true,
        //     // 'icon' : 'business_center',
        //     'url'  : '',
        //     'children': []
        // },
        {
            'id'      : 'favoritesGroup',
            'title'   : 'FAVOURITES',
            'type'    : 'group',
            // 'icon' : 'business_center',
            'url'  : '',
            hidden: true,
            'children': [
            ]
        },
    ];;

    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        private _authService: AuthenticationService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
        this._authService.user.subscribe(user => {
            if (user) {
                this.user = user
                this.isLoggedIn = true;
                
            } else {
                this.user = null

            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Directive
    @ViewChild(FusePerfectScrollbarDirective)
    set directive(theDirective: FusePerfectScrollbarDirective)
    {
        if ( !theDirective )
        {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this._fusePerfectScrollbar.update();
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                    setTimeout(() => {
                        const activeNavItem: any = document.querySelector('navbar .nav-link.active');

                        if ( activeNavItem )
                        {
                            const activeItemOffsetTop       = activeNavItem.offsetTop,
                                  activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
                                  scrollDistance            = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3) - 168;

                            this._fusePerfectScrollbar.scrollToTop(scrollDistance);
                        }
                    });
                }
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                    if ( this._fuseSidebarService.getSidebar('navbar') )
                    {
                        this._fuseSidebarService.getSidebar('navbar').close();
                    }
                }
            );

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(): void
    {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void
    {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }



}
