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
        nodeService.node.subscribe(node => {
            if (node) {
                this.updateNodeNav(node)
            }
        })
    }

    updateNodeNav (node) {
        let urlBase = `/node/${node.node_type}/${node._id}/`;
        var nav = 
            [{
                'id'   : 'tree',
                'title': 'Tree',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : urlBase + 'tree',
                'hidden' : false,
            },
            {
                'id'   : 'details',
                'title': 'Details',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url' : urlBase + 'edit',
                'hidden' : false,
            },
            {
                'id'   : 'chat',
                'title': 'Chat',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : urlBase + 'chat',
                'hidden' : false,
            },
            {
                'id'   : 'docs',
                'title': 'Documents',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : urlBase + 'documents',
                'hidden' : false,
            },
            {
                'id'   : 'tasks',
                'title': 'Tasks',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : urlBase + 'tasks',
                'hidden' : false,
            },
            {
                'id'   : 'perms',
                'title': 'Permissions',
                // 'translate': 'NAV.SAMPLE.TITLE',
                'type' : 'item',
                // 'icon' : 'business_center',
                'url'  : urlBase + 'permissions',
                'hidden' : false,
            }]
        this.navigation.next(nav)
    }
}