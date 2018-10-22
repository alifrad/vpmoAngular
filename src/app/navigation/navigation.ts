export const navigation = [
    {
        'id'      : 'TEAM',
        'title'   : 'TEAMS',
        // 'translate': 'NAV.ORGANISATIONS',
        'type'    : 'group',
        'icon' : 'business_center',
        'url'  : '/team/all',
        'children': [
            // {
            //     'id'   : 'TeamTree',
            //     'title': 'Team Tree (see projects)',
            //     'translate': 'NAV.SAMPLE.TITLE',
            //     'type' : 'item',
            //     'icon' : 'business_center',
            //     'url'  : '/team/tree',
            //     'badge': {
            //         'title': 25,
            //         'translate': 'NAV.SAMPLE.BADGE',
            //         'bg'   : '#F44336',
            //         'fg'   : '#FFFFFF'
            //     }
            // },
            // {
            //     'id'   : 'TeamMembers',
            //     'title': 'People',
            //     // 'translate': 'NAV.AddOrganisation.TITLE',
            //     'type' : 'item',
            //     'icon' : 'add_box',
            //     'url'  : '/team/members/',
            // },
            // {
            //     'id'   : 'MyTeams',
            //     'title': 'My Teams',
            //     // 'translate': 'NAV.AddOrganisation.TITLE',
            //     'type' : 'item',
            //     'icon' : 'list',
            //     'url'  : '/team/all/',
            // }
        ]
    },
    {
        'id'      : 'FAVOURITES',
        'title'   : 'FAVOURITES',
        // 'translate': 'NAV.ORGANISATIONS',
        'type'    : 'group',
        'children': [
            {
                'id'   : '000000001',
                'title': 'Project ABC',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'visibility',
                'url'  : '/projects/abc',
            },
            {
                'id'   : '000000002',
                'title': 'Issue 127',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'add_box',
                'url'  : '/projects/add',
            },
            {
                'id'   : '000000003',
                'title': 'Team ABC',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'view_module',
                'url'  : '/projects/',
            }
        ]
    }
];
