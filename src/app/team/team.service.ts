
import {throwError as observableThrowError } from 'rxjs';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Response, RequestOptions } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';


import { Team } from './team';
import { CustomHttpClient } from '../_services/custom-http.service';
import { MessageService } from '../shared/message.service';
import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';
import { HttpErrorResponse } from '@angular/common/http/src/response';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  token: string;
  private httpOptions: Object;

  constructor(
    private http: CustomHttpClient,
    private authService: AuthenticationService,
  ) { }
  
  getCurrentTeam(): Observable<any> {
    if (!localStorage.getItem('currentUser')) {
        console.log('user has not logged in!');
    } else {
        return of(localStorage.getItem('team'));
    }
  }
 
  getTeams(): Observable<any> {
    return this.http.get(appConfig.apiUrl + `/nodes/` + '?nodeType=Team');
  }

  getUserTeamPerm(_id, team: number) {
    return this.http.get(appConfig.apiUrl + `/user_perms/?user=${_id}&team=${team}`);
  }

  createUserTeamPerm(_id, team: number) {
    return this.http.post(appConfig.apiUrl + '/users_perm', { user: _id, team: team, permission: 'contribute_obj'});
  }

  createTeam (teamName: string): Observable<any> {
    var data = {
      name: teamName
    }
    return this.http.post(appConfig.apiUrl+'/teams/add/', data)
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return observableThrowError(err.message);
  }
}


