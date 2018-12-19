import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject ,  Subscription } from 'rxjs';
import { ChatService } from 'app/chat/chat.service';
import { NodeService } from '../node/node.service';

@Component({
  selector: 'team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss', './teams-list.component.scss']
})
export class TeamDashboardComponent implements OnInit, OnDestroy {

  @Input()
  nodeID: string;


  projects: any[] = [];
  unreadMessages: any;
  _unsubscribeAll: Subject<any>;

  constructor(
      private teamService: TeamService,
      private router: Router,
      private chatService: ChatService,
      private nodeService: NodeService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.chatService.unreadMessageTracker
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(unreadMessages => {
        this.unreadMessages = unreadMessages
        this.setUnreadMessages()
      })

    this.nodeService.node
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(node => {
        if (node && node.node_type == 'Team') {
          this.projects = node.children
        }
      })
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
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
        if (this.unreadMessages[this.projects[project].child_nodes[child]._id] != undefined) {
          this.projects[project].unreadMessages += this.unreadMessages[this.projects[project].child_nodes[child]._id]
        }
      }
    }
  }

  goToNode (node) {
    this.router.navigate(['/node/Project/' + node._id + '/projectDashboard']);
  }
}
