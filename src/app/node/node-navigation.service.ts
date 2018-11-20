import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { NodeService } from '../node/node.service';
import { appConfig } from '../app.config';


@Injectable()

export class NavigationService {
    
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
            'url'  : '/',
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
        'hidden' : false,
        // 'icon' : 'business_center',
        'url'  : '',
        'children': [
            {
                'id'   : 'tree',
                'title': 'Tree',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : '',
                'hidden' : true,
            },
            {
            'id'   : 'details',
            'title': 'Details',
            'type' : 'item',
            'icon' : 'business_center',
            'url'  : 'app-node-edit',
            'hidden' : true,
            },
            {
                'id'   : 'chat',
                'title': 'Chat',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'app-chat',
                'hidden' : true,
            },
            {
                'id'   : 'docs',
                'title': 'Documents',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'project/all',
                'hidden' : true,
            },
            {
                'id'   : 'tasks',
                'title': 'Tasks',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'project/all',
                'hidden' : true,
            },
            {
                'id'   : 'perms',
                'title': 'Permissions',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'project/all',
                'hidden' : true,
            },
        ]},
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
            ]},
    
    ];

    navigationValue = new BehaviorSubject<string>(JSON.stringify(this.nav));

    

    constructor(
        private nodeService: NodeService,
    ){
        // nodeService.node.subscribe((val) => {
            
        //         // alert('node: ' + val);
        //         // if ( node !== '' && node !== null ) { 
        //             // debugger;
        //             this.node = JSON.parse(val);
        //             this.nodeLink = this.node.type + '/' + this.node.id;
        //             this.updateNodeNav();
        //             // if (node.type === 'Team') {
        //             //     this.updateTeamNav();
        //             // } else if (node.type === 'Project') {
        //             //     this.updateProjectNav();
        //             // } else if (node.type === 'Topic') {
        //             //     this.updateTopicNav();
        //             // }
        //         // } else { 
        //         //     throw new Error('node is not defined yet');
        //         // };
        //     }
        // );
    }

    private readonly apiUrl: string = `${appConfig.apiUrl}/node/`;
    // private nodeUrl: string = this.apiUrl + '/node/'

    private nodeTree = this.apiUrl + 'tree/' + this.nodeLink;
    private nodeDetails = this.apiUrl + 'details/' + this.nodeLink;
    private nodeChat = this.apiUrl + 'chat/' + this.nodeLink;
    private nodeDocs = this.apiUrl + 'douments/' + this.nodeLink;
    private nodeTasks = this.apiUrl + 'tasks/' + this.nodeLink;
    private nodePerms = this.apiUrl + 'permissions/' + this.nodeLink;

    
    

    updateNodeNav() {
        // this.nav
        //     .find(item => item.id === 'nodePages').children
        //     .find(item => item.id === 'details').url = this.nodeDetails;
        // this.nav
        //     .find(item => item.id === 'nodePages').children
        //     .find(item => item.id === 'tree').url = this.nodeTree;
        // this.nav
        //     .find(item => item.id === 'nodePages').children
        //     .find(item => item.id === 'chat').url = this.nodeChat;
        // this.nav
        //     .find(item => item.id === 'nodePages').children
        //     .find(item => item.id === 'docs').url = this.nodeDocs;
        // this.nav
        //     .find(item => item.id === 'nodePages').children
        //     .find(item => item.id === 'tasks').url = this.nodeTasks;
        // this.nav
        //     .find(item => item.id === 'nodePages').children
        //     .find(item => item.id === 'tasks').url = this.nodePerms;
        
        // this.navigation = this.nav;
        this.navigation = '1212121';
    }

    updateTeamNav() {
        this.nav
            .find(item => item.id === 'nodePages').children
            .find(item => item.id === 'details').hidden = true;
        this.nav
            .find(item => item.id === 'nodePages').children
            .find(item => item.id === 'tasks').hidden = true;
        this.nav
            .find(item => item.id === 'nodePages').children
            .find(item => item.id === 'docs').hidden = true;
        this.nav
            .find(item => item.id === 'nodePages').children
            .find(item => item.id === 'chat').hidden = true;
        
        this.navigation = this.nav;
    }

    updateProjectNav() {
        this.nav
            .find(item => item.id === 'nodePages').children
            .find(item => item.id === 'tasks').hidden = true;
        
        this.navigationValue.next(this.nav);
    }

    updateTopicNav() {
        this.nav
            .find(item => item.id === 'nodePages').children
            .find(item => item.id === 'tree').hidden = true;
        
        this.navigation = this.nav;
    }

    set navigation(value: string) {
        this.navigationValue.next(value);
        localStorage.setItem('navigation', JSON.stringify(value));
    }

    get navigation() {
        return localStorage.getItem('navigation');
    }

}
