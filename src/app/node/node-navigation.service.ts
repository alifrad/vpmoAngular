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

    constructor(
        // private nodeService: NodeService,
    ){
        // nodeService.node.subscribe(
        //     node => { 
        //         this.node = node;
        //         this.updateNodeNav();
        //         if (node.type === 'Team') {
        //             this.updateTeamNav();
        //         } else if (node.type === 'Project') {
        //             this.updateProjectNav();
        //         } else if (node.type === 'Topic') {
        //             this.updateTopicNav();
        //         }
                
        //     },
        //     err => console.log(err),
        // );
    }

    private readonly apiUrl: string = `${appConfig.apiUrl}`;
    // private readonly nodeUrl: string = this.apiUrl + '/node/' + this.node.type + '/' + this.node.id + '/';

    // private nodeTree = this.nodeUrl + 'tree';
    // private nodeDetails = this.nodeUrl + 'details';
    // private nodeChat = this.nodeUrl + 'chat';
    // private nodeDocs = this.nodeUrl + 'douments';
    // private nodeTasks = this.nodeUrl + 'tasks';
    // private nodePerms = this.nodeUrl + 'permissions';

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
                'hidden' : false,
            },
            {
            'id'   : 'details',
            'title': 'Details',
            'type' : 'item',
            'icon' : 'business_center',
            'url'  : 'app-node-edit',
            'hidden' : false,
            },
            {
                'id'   : 'chat',
                'title': 'Chat',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'app-chat',
                'hidden' : false,
            },
            {
                'id'   : 'docs',
                'title': 'Documents',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'project/all',
                'hidden' : false,
            },
            {
                'id'   : 'tasks',
                'title': 'Tasks',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'project/all',
                'hidden' : false,
            },
            {
                'id'   : 'perms',
                'title': 'Permissions',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : 'project/all',
                'hidden' : false,
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

    navigation = new BehaviorSubject(this.nav);

    // updateNodeNav() {
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'details').url = this.nodeDetails;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'tree').url = this.nodeTree;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'chat').url = this.nodeChat;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'docs').url = this.nodeDocs;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'tasks').url = this.nodeTasks;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'tasks').url = this.nodePerms;
        
    //     this.navigation.next(this.nav);
    // }

    // updateTeamNav() {
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'tasks').hidden = true;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'docs').hidden = true;
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'chat').hidden = true;
        
    //     this.navigation.next(this.nav);
    // }

    // updateProjectNav() {
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'tasks').hidden = true;
        
    //     this.navigation.next(this.nav);
    // }

    // updateTopicNav() {
    //     this.nav
    //         .find(item => item.id === 'nodePages').children
    //         .find(item => item.id === 'tree').hidden = true;
        
    //     this.navigation.next(this.nav);
    // }

}
