import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { appConfig } from '../app.config';

import { IProject } from './project';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { AuthenticationService } from '../_services';

@Injectable()
export class ProjectService {

  // url for crud operation of teamTree
  private readonly projectsUrl: string = `${appConfig.apiUrl}/projects/`;
  private readonly nodeUpdateUrl: string = `${appConfig.apiUrl}/node/`;
  private httpOptions = {
    // for auntification
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken
    })
  };

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  getProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(this.projectsUrl , this.httpOptions)
        // .do(data => console.log('All Projects: ' + JSON.stringify(data)))
        .catch(this.handleError);
  }

  partialUpdateProject (projectId: string, projectContent: string): Observable<IProject[]> {

    return this.http.patch<IProject[]>(this.nodeUpdateUrl + 'Project/' + projectId + '/', {content: projectContent}, this.httpOptions)
      .catch(this.handleError);
  }

  getProject (projectId: string): Observable<IProject> {
    return this.http.get<IProject>(this.nodeUpdateUrl + 'Project/' + projectId + '/', this.httpOptions)
     .catch(this.handleError);
 }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

  create(project: IProject) {
    return this.http.post(this.projectsUrl + '/add', project);
  }

}
