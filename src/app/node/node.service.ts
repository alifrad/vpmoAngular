import { Injectable } from '@angular/core';
import { AuthenticationService } from 'app/_services';
import { appConfig } from '../app.config';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly nodeDetailUrl: string = this.apiUrl + '/node/'
  
  constructor(
    private http: HttpClient, 
    private authUser: AuthenticationService,
    ) { }

  private httpOptions = {
    // for authentication
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken()
    })
  };

  getNodeDetails (nodeID: string): Observable<any> {
    return this.http.get(this.nodeDetailUrl + nodeID + '/', this.httpOptions)
      .catch(this.handleError)
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
