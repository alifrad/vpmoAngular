import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from './authentication.service'

@Injectable()
export class CustomHttpClient {

  private token: string = '';

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    authService.user.subscribe(user => {
      if (user) {
        this.token = user.token
      }
    })
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append("Content-Type", "application/json")
    headers = headers.append('Authorization', 'JWT ' + this.token); 
    return headers
  }

  get(url) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    console.log(headers)
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
}