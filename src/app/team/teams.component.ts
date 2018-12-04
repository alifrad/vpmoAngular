import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { ChatService } from 'app/chat/chat.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {

  teams: any[] = [];
  errorMessage: string;
  node: any;
  team: any;
  newTeamName: string;
  dialogRef: any;
  unreadMessages: any;

  unreadMessageSubscription: Subscription;

  constructor(
      private authenticationService: AuthenticationService,
      private teamService: TeamService,
      private router: Router,
      private globalService: GlobalService,
      private dialog: MatDialog,
      private chatService: ChatService
  ) { }

  teamTree(team: Team) {
    // debugger;
    localStorage.setItem('nodeType', 'Team');
    // this.globalService.team = JSON.stringify(team);
    // this.globalService.node = JSON.stringify(team);
    this.router.navigate(['/node/Team/' + team._id + '/tree']);
  }


  getNode(nodeId: string) {
    this.router.navigate(['/node/Team/' + nodeId + '/dashboard']);
  }

  ngOnInit() {
    this.getTeams()

    this.unreadMessageSubscription = this.chatService.unreadMessageTracker.subscribe(unreadMessages => {
      this.unreadMessages = unreadMessages
      this.setUnreadMessages()
    })
  }

  ngOnDestroy () {
    this.unreadMessageSubscription.unsubscribe();
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
    for (var team = 0; team < this.teams.length; team++) {
      this.teams[team].unreadMessages = 0

      if (this.unreadMessages[this.teams[team]._id] != undefined) {
        this.teams[team].unreadMessages += this.unreadMessages[this.teams[team]._id]
      }

      for (var child = 0; child < this.teams[team].child_nodes.length; child++) {
        if (this.unreadMessages[this.teams[team].child_nodes[child]] != undefined) {
          this.teams[team].unreadMessages += this.unreadMessages[this.teams[team].child_nodes[child]]
        }
      }
    }
  }



  openTeamCreateDialog (templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '250px',
    });
    this.dialogRef = dialogRef

    var self = this
    dialogRef.afterClosed().subscribe(result => {
      self.newTeamName = ''
      self.dialogRef = null
      self.getTeams()
    });
  }

  createNewTeam () {
    if (!this.newTeamName) {
      alert('Please type in a team name')
      return
    }

    var self = this
    this.teamService.createTeam(this.newTeamName)
      .subscribe(createdTeam => {
        alert('Team Created')
        self.dialogRef.close()
      })
  }
  
}
