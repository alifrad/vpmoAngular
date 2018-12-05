import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChatService } from 'app/chat/chat.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss', './teams-list.component.scss']
})
export class TeamDashboardComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  nodeID: string;


  projects: any[] = [];
  unreadMessages: any;
  unreadMessageSubscription: Subscription;

  constructor(
      private teamService: TeamService,
      private router: Router,
      private chatService: ChatService
  ) { }

  ngOnInit() {
    this.unreadMessageSubscription = this.chatService.unreadMessageTracker.subscribe(unreadMessages => {
      this.unreadMessages = unreadMessages
      this.setUnreadMessages()
    })
  }

  ngOnChanges (changes) {
    this.getProjects(changes['nodeID'].currentValue)
  }

  ngOnDestroy () {
    this.unreadMessageSubscription.unsubscribe()
  }

  getProjects (nodeID) {
    this.teamService.getTeamProjects(nodeID)
      .subscribe(response => {
        this.projects = response
        this.setUnreadMessages()
      })
  }

  /*
   * Goes over all projects and sets unread messages on each
   */
  setUnreadMessages() {
    for (var project = 0; project < this.projects.length; project++) {
      this.projects[project].unreadMessages = 0

      if (this.unreadMessages[this.projects[project]._id] != undefined) {
        this.projects[project].unreadMessages += this.unreadMessages[this.projects[project]._id]
      }

      for (var child = 0; child < this.projects[project].child_nodes.length; child++) {
        if (this.unreadMessages[this.projects[project].child_nodes[child]] != undefined) {
          this.projects[project].unreadMessages += this.unreadMessages[this.projects[project].child_nodes[child]]
        }
      }
    }
  }

  goToNode (node) {
    this.router.navigate(['/node/Project/' + node._id + '/dashboard']);
  }

}
