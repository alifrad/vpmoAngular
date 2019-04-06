import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



import { appConfig } from '../app.config';

import { IProject } from './project';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { AuthenticationService } from '../_services';
import { CustomHttpClient } from '../_services/custom-http.service';

@Injectable()
export class ProjectService {

  // url for crud operation of teamTree
  private readonly projectsUrl: string = `${appConfig.apiUrl}/projects/`;
  private readonly nodeRetrieveUpdateUrl: string = `${appConfig.apiUrl}/node/`;

  constructor(private http: CustomHttpClient, private authService: AuthenticationService) { }


  getProjects(): Observable<any> {
    return this.http.get(this.projectsUrl)
  }

  partialUpdateProject (projectId: string, projectContent: string): Observable<any> {
    return this.http.patch(this.nodeRetrieveUpdateUrl + projectId + '/', {content: projectContent})
  }

  getProject (projectId: string): Observable<any> {
    return this.http.get(this.nodeRetrieveUpdateUrl + projectId + '/')
 }

  create(project: IProject) {
    return this.http.post(this.projectsUrl + '/add', project);
  }

  getTopicsUnderProject(parentNodeID, topicType) {
    return this.http.get(appConfig.apiUrl + '/nodes/?nodeType='+topicType+'&parentNodeID='+parentNodeID)
  }
}
