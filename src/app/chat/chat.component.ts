import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// import { Socket } from 'ngx-socket-io';
import { ChatService } from './chat.service';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {

  constructor(
  	// private socket: Socket,
  	private router: Router,
    private _chatService: ChatService,
    private authUser: AuthenticationService
  ) { }

  messages: string[] = [];
  node: any;
  chatSocket: any;
  maxMessageLength: 20;


  ngOnDestroy () {
    this.chatSocket.close()
  }

  ngOnInit() {
    var cookie = this.authUser.getToken()
    this.chatSocket = new WebSocket(
        'ws://127.0.0.1:8000/ws/chat/'+localStorage.getItem('node')+'/?'+this.authUser.getToken()
    );

    this.node = localStorage.getItem("node")
  	this._chatService.getMessages(this.node)
      .subscribe(
        messages => this.messages = messages
      );
    console.log("Receivde messages", this.messages)

    var currentThis = this
    this.chatSocket.onmessage = function (e) {
      console.log("Recieved", e.data)
      var data = JSON.parse(e.data).message
      currentThis.messages.push(data)
    }
  }


  private sendMessage (msg) {
    var data = {
      'content': msg,
      'sent_on': new Date()
    }

    this.chatSocket.send(JSON.stringify(data))
  }

}
