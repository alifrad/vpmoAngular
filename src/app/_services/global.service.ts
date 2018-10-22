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
  
  nav: any[];

  constructor(  )
  { this.nav = navigation; }
  
  navigationValue = new BehaviorSubject<any[]>([ {
    'id'      : 'TEAM',
    'title'   : 'TEAMS',
    'type'    : 'group',
    'icon' : 'business_center',
    'url'  : '/team/all',
    'children': [
      {
          'id'   : 'TeamTree',
          'title': 'Team Tree (see projects)',
          // 'translate': 'NAV.SAMPLE.TITLE',
          'type' : 'item',
          'icon' : 'business_center',
          'url'  : '/team/tree',
          'hidden' : false,
          'badge': {
              'title': 25,
              'translate': 'NAV.SAMPLE.BADGE',
              'bg'   : '#F44336',
              'fg'   : '#FFFFFF'
          }
      }
    ]
  }]);

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
