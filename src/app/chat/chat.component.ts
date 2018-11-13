import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthenticationService } from '../_services';
import { appConfig } from '../app.config';

declare const Twilio: any

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

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

  ngOnDestroy () {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => { 
        this.nodeID = params['id'];
        this.connectToChat()
      }
    );

    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked () {
    
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

  setupChannel () {
    this.channel.join().then(function (channel) {
      console.log('Joined Channel', channel)
    })

    this.channel.on('messageAdded', function (message) {
      console.log('Message added', message)
    })
  }

  private onScroll (e) {
    /*
    if (e.target.scrollTop === 0 && this.messages.length > 0) {
      const olderMessages = [];
      this._chatService.getMessages(this.node, this.messages[0]._id)
      .subscribe(
        messages => {
          for ( let i = messages.length; i >= 0; i--) {
            if (messages[i] !== undefined) {
              this.messages.unshift(messages[i]);
            } 
          }
        }
      );
    }
    */
  }

  private sendMessage (msg) {
    this.channel.sendMessage(msg)
  }

}
