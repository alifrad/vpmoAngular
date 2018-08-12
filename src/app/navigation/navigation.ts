export const navigation = [
    {
        'id'      : 'ORGANISATIONS',
        'title'   : 'ORGANISATIONS',
        // 'translate': 'NAV.ORGANISATIONS',
        'type'    : 'group',
        'children': [
            {
                'id'   : 'sample',
                'title': 'ABC Corp.',
                'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'business_center',
                'url'  : '/sample',
                'badge': {
                    'title': 25,
                    'translate': 'NAV.SAMPLE.BADGE',
                    'bg'   : '#F44336',
                    'fg'   : '#FFFFFF'
                }
            },
            {
                'id'   : 'AddOrganisation',
                'title': 'Create Organisation',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'add_box',
                'url'  : '/orgs/add',
            },
            {
                'id'   : 'MyOrganisations',
                'title': 'My Organisations',
                // 'translate': 'NAV.AddOrganisation.TITLE',
                'type' : 'item',
                'icon' : 'list',
                'url'  : '/orgs/all',
            }
        ]
    },
    {
        'id'      : 'PROJECTS',
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
