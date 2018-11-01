import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';

import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class DocumentsService {

  private readonly apiUrl: string = `${appConfig.docApiUrl}`;
  private readonly getDocumentsUrl: string = this.apiUrl + '/node_documents/'
  private readonly docManagementUrl: string = this.apiUrl + '/document_management_view/';
  private readonly docCreationUrl: string = this.apiUrl + '/create_document/';

  private httpOptions = {
    // for authentication
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken()
    })
  };

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  getUploadedDocuments (nodeID: string, nodeType: string): Observable<any> {
    return this.http.get(this.getDocumentsUrl + nodeID + '/?nodeType=' + nodeType, this.httpOptions)
      .catch(this.handleError)
  }

  getFileUploadUrl (nodeID: string, nodeType: string, docName: string): Observable<any> {
    var data = {
      fileName: docName
    }
    return this.http.post(this.docManagementUrl+nodeID +'/?nodeType='+nodeType, data, this.httpOptions)
      .catch(this.handleError)
  }

  uploadFileS3 (presignedUrl: string, file: any, contentType: string): Observable<any> {
    const s3Headers = new HttpHeaders({
      'Content-Type': contentType,
    })
    return this.http.put(presignedUrl, file, {headers: s3Headers, reportProgress: true})
      .catch(this.handleError)
  }

  createDocument (nodeID: string, nodeType: string, fileName: string): Observable<any> {
    var data = {
      'fileName': fileName
    }
    return this.http.post(this.docCreationUrl + nodeID + '/?nodeType=' + nodeType, data, this.httpOptions)
      .catch(this.handleError)
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}