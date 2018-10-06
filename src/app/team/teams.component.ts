import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';
import { Router } from '@angular/router';

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
      private router: Router
  ) { }

  teamTree(id: string) {
    localStorage.setItem('teamID', id);
    localStorage.setItem('nodeType', 'Team');
    this.router.navigate(['/team/tree']);
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
