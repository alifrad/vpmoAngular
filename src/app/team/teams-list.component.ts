import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import { MatDialog, MatDialogConfig, MatBottomSheet } from '@angular/material';
import { ChatService } from 'app/chat/chat.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { UnreadMessagesPanelComponent } from 'app/chat/unread-messages-panel.component';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var $: any;

/* TODO: Topic-Panel may need to be rewritten without fuse, since we're removing fuse altogether */


@Component({
  selector: 'teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit, OnDestroy {

  teams: any[] = [];
  errorMessage: string;
  node: any;
  team: any;
  newTeamName: string;
  dialogRef: any;
  unreadMessages: any;
  favoriteNodeIds: string[] = [];

  _unsubscribeAll = new Subject<any>();

  constructor(
      private authenticationService: AuthenticationService,
      private teamService: TeamService,
      private router: Router,
      private globalService: GlobalService,
      private dialog: MatDialog,
      private chatService: ChatService,
      private loadingService: LoadingService,
      private bottomSheet: MatBottomSheet,
  ) { }

  teamTree(team: Team) {
    // debugger;
    localStorage.setItem('nodeType', 'Team');
    // this.globalService.team = JSON.stringify(team);
    // this.globalService.node = JSON.stringify(team);
    this.router.navigate(['/node/Team/' + team._id + '/tree']);
  }


  getNode(nodeId: string) {
    this.router.navigate(['/node/Team/' + nodeId + '/details']);
  }

  ngOnInit() {
    this.getTeams()

    this.chatService.unreadMessageTracker
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(unreadMessages => {
        this.unreadMessages = unreadMessages
        this.setUnreadMessages()
      })

    this.authenticationService.favoriteNodes
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(favoriteNodes => {
        favoriteNodes.forEach(i => {
            this.favoriteNodeIds.push(i._id)
        })
      })
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getTeams () {
    this.teamService.getTeams().subscribe(
      teams =>  
      {
        this.teams = teams;
        this.setUnreadMessages()
      },
      error => this.errorMessage = <any>error
    );
  }


  /*
   * Goes over all teams and sets unread messages on each
   */
  setUnreadMessages() {
    if (this.unreadMessages) {
      for (var team = 0; team < this.teams.length; team++) {
        this.teams[team].unreadMessages = 0

        if (this.unreadMessages[this.teams[team]._id] != undefined) {
          this.teams[team].unreadMessages += this.unreadMessages[this.teams[team]._id]
        }

        for (var child = 0; child < this.teams[team].child_nodes.length; child++) {
          if (this.unreadMessages[this.teams[team].child_nodes[child]._id] != undefined) {
            this.teams[team].unreadMessages += this.unreadMessages[this.teams[team].child_nodes[child]._id]
          }
        }
      }
    }
  }

  openTeamCreateDialog (templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        panelClass: "modal-createteam"
    });
    this.dialogRef = dialogRef

    var self = this
    dialogRef.afterClosed().subscribe(result => {
      self.newTeamName = ''
      self.dialogRef = null
    });
  }

  createNewTeam () {
    if (!this.newTeamName) {
      alert('Please type in a team name')
      return
    }

    var self = this
    var taskID = this.loadingService.startTask()
    this.teamService.createTeam(this.newTeamName)
      .subscribe(createdTeam => {
        this.loadingService.taskFinished(taskID)

        // Adding the createdTeam to the displayed array
        createdTeam.topic_counts = {} // This can be empty since there won't be any topics on a new object
        this.teams.push(createdTeam)

        $("#createTeam").modal("hide")
      })
  }

  openUnreadMessagesPanel(team) {
    const bottomSheetRef = this.bottomSheet.open(UnreadMessagesPanelComponent, {
      data: { node: team },
    });
  }

  openListPanel(nodeId, topicType) {
    this.getNode(nodeId);
    console.log("Fuse-TopicPanel sidebar needs to be rewritten.")    
  }

}
