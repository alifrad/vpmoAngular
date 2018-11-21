import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { NodeService } from 'app/node/node.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Team[] = [];
  errorMessage: string;
  node: any;
  team: any;
  newTeamName: string;
  dialogRef: any;

  constructor(
      private authenticationService: AuthenticationService,
      private teamService: TeamService,
      private router: Router,
      private globalService: GlobalService,
      private dialog: MatDialog,
      private nodeService: NodeService,
  ) { 
  
  }

  teamTree(team: Team) {
    // debugger;
    localStorage.setItem('nodeType', 'Team');
    this.globalService.team = JSON.stringify(team);
    this.globalService.node = JSON.stringify(team);
    this.router.navigate(['/node/Team/' + team._id]);
  }


  getNode(nodeId: string) {
    this.nodeService.getNodeDetails(nodeId);
    this.router.navigate(['node/' + nodeId]);
  }

  ngOnInit() {
    this.getTeams()
  }

  getTeams () {
    this.teamService.getTeams().subscribe(
      teams =>  
      {
        this.teams = teams;
      },
      error => this.errorMessage = <any>error
    );
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
