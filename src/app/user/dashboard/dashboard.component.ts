import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fullname: any;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.getUserName()
      .subscribe(
          user => this.fullname = user,
          (err: any) => console.log(err)
      );
    console.log(this.fullname);
  }

}
