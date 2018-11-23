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
        'id'      : 'general',
        'title'   : 'General',
        'type'    : 'group',
        'url'  : '',
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
            'icon' : 'business_center',
            'url'  : '/team/all',
            'hidden' : false,
        },
        ]},
        {
            'id'      : 'nodePages',
            'title'   : 'Node',
            'type'    : 'group',
            'hidden' : true,
            // 'icon' : 'business_center',
            'url'  : '',
            'children': []
        },
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

    nodeNavigationSubscription: Subscription;
    favoriteNodesSubscription: Subscription;
    unreadMessagesSubscription: Subscription;

    constructor(
        private sidebarService: FuseSidebarService,
        private navigationService: FuseNavigationService,
        private router: Router,
        private nodeService: NodeService,
        private nodeNavigationService: NodeNavigationService,
        private globalService: GlobalService,
        private authService: AuthenticationService,
        private chatService: ChatService
    )
    {
        // Navigation data
        // this.navigation = navigation;
        this.nodeNavigationSubscription = nodeNavigationService.navigation.subscribe(
            nav => {
                this.updateNodeNav(nav)
            }
        );

        this.unreadMessagesSubscription = chatService.unreadMessageTracker.subscribe(unreadMessages => {
            this.updateFavoriteNodesNav(authService.favoriteNodes.value, unreadMessages)
        })

        this.favoriteNodesSubscription = authService.favoriteNodes.subscribe(favoriteNodes => {
            this.updateFavoriteNodesNav(favoriteNodes, chatService.unreadMessageTracker.value)
        })

        // Default layout
        this.layout = 'vertical';
    }

    updateNodeNav (nodeNav) {
        this.navigation.find(item => item.id == 'nodePages').hidden = false
        this.navigation.find(item => item.id == 'nodePages').children = nodeNav
    }

    updateFavoriteNodesNav (favoriteNodes, unreadMessages) {
        this.navigation.find(item => item.id == 'favoritesGroup').hidden = false
        this.navigation.find(item => item.id == 'favoritesGroup').children = []
        for (var i = 0; i < favoriteNodes.length; i++) {
            var child = {
                'id'   : favoriteNodes[i].name,
                'title': favoriteNodes[i].name,
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : '/node/'+favoriteNodes[i].node_type+'/'+favoriteNodes[i]._id+'/tree/',
                'hidden' : false,
            }
            if (unreadMessages[child.title] !== undefined) {
                child['badge'] = {
                    title: unreadMessages[child.title]
                }
            } else {
                child['badge'] = {
                    title: 0
                }
            }
            this.navigation.find(item => item.id == 'favoritesGroup').children.push(child)
        }
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
}
