import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  currentUserValue  = new Subject();
  nodeValue = new Subject();
  nodePermissionValue = new Subject();
  teamValue = new Subject();
  projectValue = new Subject(); 
  topicValue = new Subject();

  set currentUser(value) {
    this.currentUserValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('currentUser', value);
  }

  get currentUser() {
    return localStorage.getItem('currentUser');
  }

  set nodeId(value) {
    this.nodeValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('nodeId', value);
  }

  get nodeId() {
    return localStorage.getItem('nodeId');
  }

  set nodePermissoin(value) {
    this.nodePermissionValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('nodePermission', value);
  }

  get nodePermissoin() {
    return localStorage.getItem('nodePermission');
  }

  set teamId(value) {
    this.teamValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('teamId', value);
  }

  get teamId() {
    return localStorage.getItem('teamId');
  }

  set projectId(value) {
    this.projectValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('projectId', value);
  }

  get projectId() {
    return localStorage.getItem('projectId');
  }

  set topicId(value) {
    this.topicValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('topicId', value);
  }

  get topicId() {
    return localStorage.getItem('topicId');
  }

  // localStorage.setItem('currentUser', JSON.stringify(user));
  // localStorage.setItem('nodeID', '');
  // localStorage.setItem('nodeType', '');
  // localStorage.setItem('nodePermission', '');
  // localStorage.setItem('teamID', '');
  // localStorage.setItem('projectID', '');
  // localStorage.setItem('topicID', '');
}
