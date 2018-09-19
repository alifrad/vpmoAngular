export const navigation = [
    {
        'id'      : 'TEAM',
        'title'   : 'TEAM',
        // 'translate': 'NAV.ORGANISATIONS',
        'type'    : 'group',
        'children': [
            {
                'id'   : 'TeamTree',
                'title': 'Team Tree (see projects)',
                'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'business_center',
                'url'  : '/tree',
                'badge': {
                    'title': 25,
                    'translate': 'NAV.SAMPLE.BADGE',
                    'bg'   : '#F44336',
                    'fg'   : '#FFFFFF'
                }
            },
            {
                'id'   : 'TeamMembers',
                'title': 'People',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'add_box',
                'url'  : '/team/members/',
            },
            {
                'id'   : 'MyTeams',
                'title': 'My Teams',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'list',
                'url'  : '/team/all/',
            }
        ]
    },
    {
        'id'      : 'PROJECT',
        'title'   : 'PROJECTS',
        // 'translate': 'NAV.ORGANISATIONS',
        'type'    : 'group',
        'children': [
            {
                'id'   : 'Current',
                'title': 'Current: Project ABC',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'visibility',
                'url'  : '/projects/abc',
            },
            {
                'id'   : 'AddProject',
                'title': 'Create Project',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'add_box',
                'url'  : '/projects/add',
            },
            {
                'id'   : 'MyProjects',
                'title': 'My Projects',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'view_module',
                'url'  : '/projects/all',
            }
        ]
    }
];
