import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../../_services/authentication.service';
import { ChatService } from 'app/chat/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fullname: any;

  constructor(
  	private authService: AuthenticationService,
  	private chatService: ChatService
  ) { }

  ngOnInit() { }

}
