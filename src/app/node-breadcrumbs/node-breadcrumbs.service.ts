import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';
import { CustomHttpClient } from '../_services/custom-http.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class NodeBreadcrumbsService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;

  constructor(private http: CustomHttpClient, private authService: AuthenticationService) { }
}
