import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthenticationService } from '../_services';
import { appConfig } from '../app.config';

declare const Twilio: any

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})

export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {

  constructor(
    private router: Router,
    private _chatService: ChatService,
    private authUser: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  @ViewChild('chatContainer') chatContainer;

  messages: any[] = [];
  nodeID: string;
  chatToken: string;
  chatClient: any;
  channel: any;
  currentUser: any;

  ngOnDestroy () {
  }

  ngOnInit() {
    this.authUser.getUser().subscribe(data => {
      this.currentUser = data.username
      console.log(this.currentUser)
    })
    
    this.route.params.subscribe(
      params => {
        this.nodeID = params['id'];
        this.connectToChat()
      }
    );

  }

  ngAfterViewChecked () {
    // this.scrollBottom()
  }

  ngAfterViewInit () {
    this.scrollBottom()
  }

  connectToChat () {
    this._chatService.getToken()
      .subscribe(response => {
        this.chatToken = response.token
        Twilio.Chat.Client.create(this.chatToken)
          .then(client => {
            this.chatClient = client
            var that = this
            this.chatClient.getSubscribedChannels().then(function (resp) {
              that.getChannel()
            })
          })
      })
  }

  getChannel () {
    var that = this
    this.chatClient.getChannelByUniqueName(this.nodeID)
      .then(function (channel) {
        that.channel = channel
        that.setupChannel()
      })
  }

  scrollBottom () {
    console.log('Scrolling')
    // This should force scroll to bottom
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  getMessages (fromIndex) {
    var pageSize = 15
    var that = this
    if (fromIndex == null) {
      that.channel.getMessages(pageSize).then(function (messages) {
        if (messages.items.length > 0) {
          for (var i = messages.items.length-1; i >= 0; i--) {
            that.messages.unshift(messages.items[i])
            that.scrollBottom()
          }
        }
      })
    } else {
      that.channel.getMessages(pageSize, fromIndex).then(function (messages) {
        if (messages.items.length > 0) {
          for (var i = messages.items.length-1; i >= 0; i--) {
            that.messages.unshift(messages.items[i])
          }
        }
      })
    }
  }

  setupChannel () {
    var that = this

    this.getMessages(null)

    this.channel.on('messageAdded', function (message) {
      that.messages.push(message)
      that.scrollBottom()
    })
  }

  private onScroll (e) {
    if (e.target.scrollTop === 0 && this.messages.length > 0) {
      const olderMessages = [];
      this.getMessages(this.messages[0].index-1)
    }
  }

  private sendMessage (msg) {
    this.channel.sendMessage(msg)
  }

}
