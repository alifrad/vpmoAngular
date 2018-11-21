import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { NodeService } from '../node/node.service';
import { appConfig } from '../app.config';
import { Router } from '@angular/router';


@Injectable()

export class NodeNavigationService {
    
    node: any;
    nodeLink: string = '';
    nav: any = [ 
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
            'id'      : 'favouritsGroup',
            'title'   : 'FAVOURITES',
            'type'    : 'group',
            // 'icon' : 'business_center',
            'url'  : '',
            'children': [
                {
                    'id'   : 'fav001',
                    'title': 'Issue 123',
                    // 'translate': 'NAV.SAMPLE.TITLE',
                    'type' : 'item',
                    // 'icon' : 'business_center',
                    'url'  : '',
                    'hidden' : false,
                },
                {
                    'id'   : 'fav002',
                    'title': 'Project XYZ',
                    'type' : 'item',
                    // 'icon' : 'business_center',
                    'url'  : '',
                    'hidden' : false,
                },
            ]
        },
    ];

    navigation = new BehaviorSubject(this.nav);

    

    constructor(
        private nodeService: NodeService,
        private router: Router,
    ){
        nodeService.node.subscribe(node => {
            if (node) {
                this.updateNodeNav(node)
            }
        })
    }

    private readonly apiUrl: string = `${appConfig.apiUrl}/node/`;

    private nodeTree = this.apiUrl + 'tree/' + this.nodeLink;
    private nodeDetails = this.apiUrl + 'details/' + this.nodeLink;
    private nodeChat = this.apiUrl + 'chat/' + this.nodeLink;
    private nodeDocs = this.apiUrl + 'douments/' + this.nodeLink;
    private nodeTasks = this.apiUrl + 'tasks/' + this.nodeLink;
    private nodePerms = this.apiUrl + 'permissions/' + this.nodeLink;


    updateNodeNav (node) {
        var nav = this.navigation.value
        
        nav.find(item => item.id == 'nodePages').hidden = false

        nav.find(item => item.id == 'nodePages').children = 
            [{
                'id'   : 'tree',
                'title': 'Tree',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : `/node/${node.type}/${node._id}/tree`,
                'hidden' : false,
            },
            {
                'id'   : 'details',
                'title': 'Details',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url' : `/node/${node.type}/${node._id}/edit`,
                'hidden' : false,
            },
            {
                'id'   : 'chat',
                'title': 'Chat',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : `/node/${node.type}/${node._id}/chat`,
                'hidden' : false,
            },
            {
                'id'   : 'docs',
                'title': 'Documents',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : `/node/${node.type}/${node._id}/documents`,
                'hidden' : false,
            },
            {
                'id'   : 'tasks',
                'title': 'Tasks',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : `/node/${node.type}/${node._id}/tasks`,
                'hidden' : false,
            },
            {
                'id'   : 'perms',
                'title': 'Permissions',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : `/node/${node.type}/${node._id}/permissions`,
                'hidden' : false,
            }]

        this.navigation.next(nav)
    }
}
