import { Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent
{
    // Private
    _variant: string;

    /**
     * Constructor
     *
     * @param {ElementRef} _elementRef
     * @param {Renderer2} _renderer
     */
    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2
    )
    {
<<<<<<< HEAD
        // Set the private defaults
        this._variant = 'vertical-style-1';
=======
        // Navigation data
        this.setInitialNavigation(this.navigation)
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


>>>>>>> 2b867be21486877121ae481dcf3c6f0787b0c77a
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Variant
     */
    get variant(): string
    {
        return this._variant;
    }

    @Input()
    set variant(value: string)
    {
        // Remove the old class name
        this._renderer.removeClass(this._elementRef.nativeElement, this.variant);

        // Store the variant value
        this._variant = value;

        // Add the new class name
        this._renderer.addClass(this._elementRef.nativeElement, value);
    }
}
