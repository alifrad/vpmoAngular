import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Team[] = [];
  errorMessage: string;
  constructor(
      private authenticationService: AuthenticationService,
      private teamService: TeamService,
  ) 
  { 
    
  }

  ngOnInit() {
    this.teamService.getTeams().subscribe(
      teams =>  this.teams = teams ,
      error => this.errorMessage = <any>error
    );
  }

  
}
