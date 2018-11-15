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
  navigationValue = new BehaviorSubject<any>(null);
  
  navStr: string;
  nav: any;
  
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
    localStorage.setItem('team', JSON.stringify(value));
    this.navigationValue.subscribe(nextValue => this.nav = JSON.parse(nextValue));
    this.nav
      .find(item => item.id === 'teamGroup').children
      .find(item => item.id === 'focusTeam').hidden = false;
    this.nav
      .find(item => item.id === 'teamGroup').children
      .find(item => item.id === 'focusTeam').title = JSON.parse(value).name;
    this.nav
      .find(item => item.id === 'teamGroup').children
      .find(item => item.id === 'focusTeam').url = '/node/Team/' + JSON.parse(value)._id;
    this.nav.find(item => item.id === 'projectGroup').hidden = false;
    this.nav
      .find(item => item.id === 'projectGroup').children
      .find(item => item.id === 'focusProject').hidden = true;
    this.nav
      .find(item => item.id === 'projectGroup').children
      .find(item => item.id === 'projects').hidden = false;
    this.nav.find(item => item.id === 'topicGroup').hidden = true;

    localStorage.setItem('project', '');
    localStorage.setItem('topic', '');

    this.navStr = JSON.stringify(this.nav);
    this.navigation = this.navStr;
  }

  get team() {
    return localStorage.getItem('team');
  }

  set project(value) {
    this.projectValue.next(value);
    localStorage.setItem('project', JSON.stringify(value));

    this.navigationValue.subscribe(nextValue => this.nav = JSON.parse(nextValue));
    this.nav
      .find(item => item.id === 'projectGroup').children
      .find(item => item.id === 'focusProject').hidden = false;
    this.nav
      .find(item => item.id === 'projectGroup').children
      .find(item => item.id === 'focusProject').title = JSON.parse(value).name;
    this.nav
      .find(item => item.id === 'projectGroup').children
      .find(item => item.id === 'focusProject').url = '/node/Project/' + JSON.parse(value)._id;
    this.nav.find(item => item.id === 'topicGroup').hidden = false;
    this.nav
      .find(item => item.id === 'topicGroup').children
      .find(item => item.id === 'focusTopic').hidden = true;
    this.nav
      .find(item => item.id === 'topicGroup').children
      .find(item => item.id === 'topics').hidden = false,
    
    localStorage.setItem('topic', '');
    
    this.navStr = JSON.stringify(this.nav);
    this.navigation = this.navStr;
  }

  get project() {
    return localStorage.getItem('project');
  }

  set topic(value) {
    this.topicValue.next(value);
    localStorage.setItem('topic', JSON.stringify(value));

    this.navigationValue.subscribe(nextValue => this.nav = JSON.parse(nextValue));
    this.nav
      .find(item => item.id === 'topicGroup').children
      .find(item => item.id === 'focusTopic').hidden = false;
    this.nav
      .find(item => item.id === 'topicGroup').children
      .find(item => item.id === 'focusTopic').title = JSON.parse(value).name;
    this.nav
      .find(item => item.id === 'topicGroup').children
      .find(item => item.id === 'focusTopic').url = '/node/Topic/' + JSON.parse(value)._id;
    
    this.navStr = JSON.stringify(this.nav);
    this.navigation = this.navStr;
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

    
}
