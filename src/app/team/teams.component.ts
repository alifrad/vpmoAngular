import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';

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

  constructor(
      private authenticationService: AuthenticationService,
      private teamService: TeamService,
      private router: Router,
      private globalService: GlobalService,
  ) { 
  
  }

  teamTree(team: Team) {
    // debugger;
    localStorage.setItem('nodeType', 'Team');
    this.globalService.team = JSON.stringify(team);
    this.globalService.node = JSON.stringify(team);
    this.router.navigate(['/node/Team/' + team._id]);
  }


  ngOnInit() {
    this.teamService.getTeams().subscribe(
      teams =>  
      {
        this.teams = teams;
      },
      error => this.errorMessage = <any>error
    );
  }

  
}
