import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';
import { navigation } from '../navigation/navigation';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {



  nodeValue = new BehaviorSubject<any>(null);
  teamValue = new BehaviorSubject<any>(null);
  projectValue = new BehaviorSubject<any>(null);
  topicValue = new BehaviorSubject<any>(null);

  navStr: string;
  nav: any;
  navInit: any = [ 
    {
    'id'      : 'teamGroup',
    'title'   : 'TEAM',
    'type'    : 'group',
    // 'icon' : 'business_center',
    'url'  : '',
    'children': [
      {
          'id'   : 'teams',
          'title': 'My Teams',
          // 'translate': 'NAV.SAMPLE.TITLE',
          'type' : 'item',
          'icon' : 'business_center',
          'url'  : '/team/all',
          'hidden' : false,
      },
      {
        'id'   : 'focusTeam',
        'title': 'ABC Co.',
        'type' : 'item',
        'icon' : 'business_center',
        'url'  : '',
        'hidden' : true,
    },
    ]},
    {
      'id'      : 'projectGroup',
      'title'   : 'PROJECTS',
      'type'    : 'group',
      // 'icon' : 'business_center',
      'url'  : '',
      'children': [
        {
            'id'   : 'project',
            'title': 'My Projects',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : '',
            'hidden' : true,
        },
        {
          'id'   : 'focusProject',
          'title': 'Test Project',
          'type' : 'item',
          'icon' : 'business_center',
          'url'  : '',
          'hidden' : true,
      },
      ]},
      {
        'id'      : 'topicGroup',
        'title'   : 'TOPIC',
        'type'    : 'group',
        // 'icon' : 'business_center',
        'url'  : '',
        'hidden' : true,
        'children': [
          {
              'id'   : 'topics',
              'title': 'My sub-projects and Topics',
              // 'translate': 'NAV.SAMPLE.TITLE',
              'type' : 'item',
              // 'icon' : 'business_center',
              'url'  : '',
              'hidden' : true,
          },
          {
            'id'   : 'focusTopic',
            'title': 'Issue 123',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : '',
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
            },
            {
              'id'   : 'fav002',
              'title': 'Project XYZ',
              'type' : 'item',
              // 'icon' : 'business_center',
              'url'  : '',
          },
          ]},
  
  ];
  navigationValue = new BehaviorSubject<any>(JSON.stringify(this.navInit));

  constructor(  )
  {}

  set node(value) {
    this.nodeValue.next(value);
    localStorage.setItem('node', value);
  }

  get node() {
    return localStorage.getItem('node');
  }

  set team(value) {
    this.teamValue.next(value);
    localStorage.setItem('team', value);
    this.navigationValue.subscribe(nextValue => this.nav = JSON.parse(nextValue));
    this.nav
      .find(item => item.id === 'teamGroup').children
      .find(item => item.id === 'focusTeam').hidden = false;
    this.nav
      .find(item => item.id === 'teamGroup').children
      .find(item => item.id === 'focusTeam').title = JSON.parse(this.team).title;
    this.navStr = JSON.stringify(this.nav);
    this.navigation = this.navStr;
  }

  get team() {
    return localStorage.getItem('team');
  }

  set project(value) {
    this.projectValue.next(value);
    localStorage.setItem('project', value);
  }

  get project() {
    return localStorage.getItem('project');
  }

  set topic(value) {
    this.topicValue.next(value);
    localStorage.setItem('topic', value);
  }

  get topic() {
    return localStorage.getItem('topic');
  }


  set navigation(value) {
    this.navigationValue.next(value);
    localStorage.setItem('navigation', value);
  }

  get navigation() {
    return localStorage.getItem('navigation');
  }

  updateNavigation() {
    
    if (this.teamValue != null ) {

    }
  }


  
}
