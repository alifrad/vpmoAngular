

export let navigation = [ 
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
        ]
    },
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
                'icon' : 'people',
                'url'  : '/team/all',
                'hidden' : false,
            }
        ]
    },
    {
        'id'      : 'favoritesGroup',
        'title'   : 'FAVOURITES',
        'type'    : 'group',
        // 'icon' : 'business_center',
        'url'  : '',
        hidden: true,
        'children': []
    }
];;