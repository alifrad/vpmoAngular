import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})

export class ChatComponent implements OnInit {

  constructor(
  	private socket: Socket,
  	private router: Router,
  ) { }

  ngOnInit() {

  }

}
