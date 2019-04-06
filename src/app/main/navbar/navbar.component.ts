import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/_services';
import { navigation } from './default-navigation'
import { ChatService } from 'app/chat/chat.service';

@Component({
    selector     : 'navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy
{
    fuseConfig: any;
    user: any = null;
    navigation: any;

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
        private _chatService: ChatService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Setting the default navigation
        this.navigation = navigation;
        this._fuseNavigationService.register('main', this.navigation);
        this._fuseNavigationService.setCurrentNavigation('main');
        
        this._authService.user
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
            if (user) {
                this.user = user
                this.updateUserNav(true);
                
            } else {
                this.user = null
                this.updateUserNav(false);
            }
        });

        this._chatService.unreadMessageTracker
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(unreadMessages => {
                this.updateFavoriteNodesNav(this._authService.favoriteNodes.value, unreadMessages)
            })

        this._authService.favoriteNodes
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(favoriteNodes => {
                this.updateFavoriteNodesNav(favoriteNodes, this._chatService.unreadMessageTracker.value)
            })
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

    changeNavItemVisibility (itemID, val) {
        this._fuseNavigationService.updateNavigationItem(itemID, {
            'hidden': val
        })
    }
    updateUserNav (userLoggedIn: Boolean) {
        if (userLoggedIn) {
            this.changeNavItemVisibility('profile', false)
            this.changeNavItemVisibility('logout', false)
            this.changeNavItemVisibility('login', true)
        } else {
            this.changeNavItemVisibility('profile', true)
            this.changeNavItemVisibility('logout', true)
            this.changeNavItemVisibility('login', false)
        };
    }

    updateFavoriteNodesNav (favoriteNodes, unreadMessages) {
        var children = []
        for (var i = 0; i < favoriteNodes.length; i++) {
            var child = {
                'id'   : favoriteNodes[i]._id,
                'title': favoriteNodes[i].name,
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'star',
                'url'  : '/node/'+favoriteNodes[i].node_type+'/'+favoriteNodes[i]._id+'/tree/',
                'hidden' : false,
            }
            if (unreadMessages[child.id] !== undefined) {
                child['badge'] = {
                    title: unreadMessages[child.id]
                }
            } else {
                child['badge'] = {
                    title: 0
                }
            }
            children.push(child)
        }
        this._fuseNavigationService.updateNavigationItem('favoritesGroup', {
            hidden: false,
            children: children
        })
    }
}
