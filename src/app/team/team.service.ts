import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { Team } from './team';
import { MessageService } from '../shared/message.service';
import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  token: string;

  constructor(
    private http: HttpClient,
    private authUser: AuthenticationService,
  ) {

  }

 
  getTeams() {
    return this.http.get<Team[]>(appConfig.apiUrl + `/filtered_organisations/`);
  }

  getUserTeamPerm(_id, team: number) {
    return this.http.get(appConfig.apiUrl + `/user_perms/?user=${_id}&team=${team}`);
  }

  createUserTeamPerm(_id, team: number) {
    return this.http.post<any>(appConfig.apiUrl + '/users_perm', { user: _id, team: team, permission: 'contribute_obj'});
  }

}


