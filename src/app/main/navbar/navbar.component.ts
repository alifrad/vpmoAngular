import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarComponent } from '@fuse/components/sidebar/sidebar.component';
import { GlobalService } from '../../_services/global.service';
import { NodeNavigationService } from 'app/node/node-navigation.service';
import { NodeService } from 'app/node/node.service';
import { AuthenticationService } from 'app/_services/authentication.service';
import { ChatService } from 'app/chat/chat.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector     : 'fuse-navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavbarComponent implements OnInit, OnDestroy
{
    private fusePerfectScrollbar: FusePerfectScrollbarDirective;

    @ViewChild(FusePerfectScrollbarDirective) set directive(theDirective: FusePerfectScrollbarDirective)
    {
        if ( !theDirective )
        {
            return;
        }

        this.fusePerfectScrollbar = theDirective;

        this.navigationServiceWatcher =
            this.navigationService.onItemCollapseToggled.subscribe(() => {
                this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this.fusePerfectScrollbar.update();
                }, 310);
            });
    }

    @Input() layout;
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
    navigationServiceWatcher: Subscription;
    fusePerfectScrollbarUpdateTimeout;
    team: any;
    unreadMessages: any = {};
    isLoggedIn: boolean;
    nodeNavigationSubscription: Subscription;
    favoriteNodesSubscription: Subscription;
    unreadMessagesSubscription: Subscription;
    user: any = null;
    fullname: any;

    constructor(
        private sidebarService: FuseSidebarService,
        private navigationService: FuseNavigationService,
        private router: Router,
        private nodeService: NodeService,
        private nodeNavigationService: NodeNavigationService,
        private globalService: GlobalService,
        private authService: AuthenticationService,
        private chatService: ChatService,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    )
    {
        // Navigation data
        
        // this.nodeNavigationSubscription = nodeNavigationService.navigation.subscribe(
        //     nav => {
        //         this.updateNodeNav(nav)
        //     }
        // );

        this.unreadMessagesSubscription = chatService.unreadMessageTracker.subscribe(unreadMessages => {
            this.updateFavoriteNodesNav(authService.favoriteNodes.value, unreadMessages)
        })

        this.favoriteNodesSubscription = authService.favoriteNodes.subscribe(favoriteNodes => {
            this.updateFavoriteNodesNav(favoriteNodes, chatService.unreadMessageTracker.value)
        })

        // Default layout
        this.layout = 'vertical';
        
        // adding customised icons
        this.matIconRegistry.addSvgIcon(
            'teams',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icon/teams.svg')
        );

        this.authService.user.subscribe(user => {
            if (user) {
                this.user = user
                this.fullname = this.user.fullname;
                this.isLoggedIn = true;
                this.updateUserNav(this.isLoggedIn);
            } else {
                this.user = null
                this.fullname = ''
                this.isLoggedIn = false;
                this.updateUserNav(this.isLoggedIn);
            }
        });
    }

    updateNodeNav (nodeNav) {
        this.navigationService.updateNavigationItem('nodePages', {
            hidden: false,
            children: nodeNav
        })
    }

    updateUserNav (userLoggedIn: Boolean) {
        if (userLoggedIn) {
            this.navigation.find(item => item.id == 'profile').hidden = false;
            this.navigation.find(item => item.id == 'logout').hidden = false;
            this.navigation.find(item => item.id == 'login').hidden = true;  
        } else {
            this.navigation.find(item => item.id == 'profile').hidden = true;
            this.navigation.find(item => item.id == 'logout').hidden = true;
            this.navigation.find(item => item.id == 'login').hidden = false;  
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
        this.navigationService.updateNavigationItem('favoritesGroup', {
            hidden: false,
            children: children
        })
    }


    ngOnInit()
    {
        this.router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationEnd )
                {
                    if ( this.sidebarService.getSidebar('navbar') )
                    {
                        this.sidebarService.getSidebar('navbar').close();
                    }
                }
            }
        );


    }

    ngOnDestroy()
    {
        if ( this.fusePerfectScrollbarUpdateTimeout )
        {
            clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        }

        if ( this.navigationServiceWatcher )
        {
            this.navigationServiceWatcher.unsubscribe();
        }

        if (this.nodeNavigationSubscription) {
            this.nodeNavigationSubscription.unsubscribe()
        }

        if (this.favoriteNodesSubscription) {
            this.favoriteNodesSubscription.unsubscribe()
        }

        if (this.unreadMessagesSubscription) {
            this.unreadMessagesSubscription.unsubscribe()
        }
    }

    toggleSidebarOpened()
    {
        this.sidebarService.getSidebar('navbar').toggleOpen();
    }

    toggleSidebarFolded()
    {
        this.sidebarService.getSidebar('navbar').toggleFold();
    }

    toJSON(data) {
        return JSON.stringify(data)
    }

    setInitialNavigation (initialNav) {
        this.navigationService.register('main', initialNav)
        this.navigationService.setCurrentNavigation('main');
    }
}
