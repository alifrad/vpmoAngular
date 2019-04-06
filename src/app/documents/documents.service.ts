import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';





import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';

import { HttpErrorResponse } from '@angular/common/http/src/response';
import { CustomHttpClient } from '../_services/custom-http.service';

@Injectable()
export class DocumentsService {

  private readonly apiUrl: string = `${appConfig.docApiUrl}`;
  private readonly getDocumentsUrl: string = this.apiUrl + '/node_documents/'
  private readonly docManagementUrl: string = this.apiUrl + '/node_document_management/';
  private readonly docCreationUrl: string = this.apiUrl + '/create_node_document/';
  private readonly docDeleteUrl: string = this.apiUrl + '/delete_node_document/';


  constructor(private http: CustomHttpClient, private authService: AuthenticationService) { }


  getUploadedDocuments (nodeID: string, nodeType: string): Observable<any> {
    return this.http.get(this.getDocumentsUrl + nodeID + '/?nodeType=' + nodeType)
  }

  getFileUploadUrl (nodeID: string, nodeType: string, docName: string): Observable<any> {
    var data = {
      fileName: docName
    }
    return this.http.post(this.docManagementUrl+nodeID +'/?nodeType='+nodeType, data)
  }

  uploadFileS3 (presignedUrl: string, file: any, contentType: string): Observable<any> {
    const s3Headers = new HttpHeaders({
      'Content-Type': contentType,
    })
    return this.http.customPut(presignedUrl, file, {headers: s3Headers, reportProgress: true})
  }

  createDocument (nodeID: string, nodeType: string, fileName: string): Observable<any> {
    var data = {
      'fileName': fileName
    }
    return this.http.post(this.docCreationUrl + nodeID + '/?nodeType=' + nodeType, data)
  }

  deleteDocument (nodeID: string, nodeType: string, docID: string): Observable<any> {
    return this.http.delete(this.docDeleteUrl + nodeID + '/' + docID + '/?nodeType=' + nodeType)
  }

  renameDocument (nodeID: string, nodeType: string, docID: string, newName: string): Observable<any> {
    var data = {
      'newName': newName
    }
    return this.http.put(this.docManagementUrl+nodeID+'/?nodeType='+nodeType+'&docID='+docID, data)
  }
}