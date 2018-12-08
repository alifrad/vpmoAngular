import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { NodeService } from '../node/node.service';
import { Router } from '@angular/router';


@Injectable()

export class NodeNavigationService {
    
    node: any;
    nodeLink: string = '';

    navigation = new BehaviorSubject([]);

    constructor(
        private nodeService: NodeService,
        private router: Router,
    ){
        // nodeService.node.subscribe(node => {
        //     if (node) {
        //         this.updateNodeNav(node)
        //     }
        // })
    }

    updateNodeNav (node) {
        let urlBase = `/node/${node.node_type}/${node._id}/`;
        var nav = 
            [{
                'id'   : 'dashboard',
                'title': 'Node Dashboard',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'navigation',
                'url'  : urlBase + 'dashboard',
                'hidden' : false,
            },
            {
                'id'   : 'tree',
                'title': 'Tree',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'navigation',
                'url'  : urlBase + 'tree',
                'hidden' : false,
            },
            {
                'id'   : 'details',
                'title': 'Details',
                'type' : 'item',
                'icon' : 'details',
                'url' : urlBase + 'edit',
                'hidden' : false,
            },
            {
                'id'   : 'chat',
                'title': 'Chat',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'chat',
                'url'  : urlBase + 'chat',
                'hidden' : false,
            },
            {
                'id'   : 'docs',
                'title': 'Documents',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'attachment',
                'url'  : urlBase + 'documents',
                'hidden' : false,
            },
            {
                'id'   : 'tasks',
                'title': 'Tasks',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'check_box',
                'url'  : urlBase + 'tasks',
                'hidden' : false,
            },
            {
                'id'   : 'perms',
                'title': 'Permissions',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'accessibility',
                'url'  : urlBase + 'permissions',
                'hidden' : false,
            }]
        if (node.node_type == 'Project') {
            nav.push({
                'id'   : 'scrumboard',
                'title': 'Scrumboard',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                'icon' : 'check_box',
                'url'  : urlBase + 'board',
                'hidden' : false,
            })
        }
        this.navigation.next(nav)
    }
}
