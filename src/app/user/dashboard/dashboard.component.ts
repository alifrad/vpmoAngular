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
  unreadMessages: any;

  constructor(
  	private authService: AuthenticationService,
  	private chatService: ChatService
  ) { }

  ngOnInit() {
    this.fullname = this.authService.getUser().fullname;
    console.log(this.fullname);
    this.chatService.unreadMessageTracker.subscribe(unreadMessages => {
    	this.unreadMessages = unreadMessages
    })
  }

  channels () {
  	return Object.keys(this.unreadMessages)
  }

}
