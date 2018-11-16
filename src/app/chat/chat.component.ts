import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, AfterViewInit, IterableDiffers, DoCheck } from '@angular/core';
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

export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit, DoCheck {

  constructor(
    private router: Router,
    private _chatService: ChatService,
    private authUser: AuthenticationService,
    private route: ActivatedRoute,
    differs: IterableDiffers
  ) {
    this.differ = differs.find([]).create(null);
  }

  @ViewChild('chatContainer') chatContainer;

  differ: any;
  messages: any[] = [];
  nodeID: string;
  chatToken: string;
  chatClient: any;
  channel: any;
  currentUser: any;
  unreadMessageCount: any;
  pageSize: any = 15;

  ngOnDestroy () {
  }

  ngDoCheck () {
    const change = this.differ.diff(this.messages);
    if (change) {
      // console.log('Scrolled')
      // this.scrollToBottom()
    }
  }

  scrollToBottom(){
    if(this.chatContainer) {
      // I can't remember why I added a short timeout, 
      // the below works great though. 
      if(this.chatContainer != undefined){
        var that = this
        setTimeout(() => { that.chatContainer.nativeElement.scrollTop = that.chatContainer.nativeElement.scrollHeight; }, 200);
      }
    }
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
    var that = this
    var lastSeenIndex = this.channel.lastConsumedMessageIndex || 0

    if (lastSeenIndex == 0) {
      this.getTotalMessageCount()
    } else {
      this.getUnconsumedMessageCount()
    }

    // Getting messages forwards from the last seen message
    console.log('Last Message', lastSeenIndex, this.channel.lastMessage)
    if (this.channel.lastMessage && lastSeenIndex > this.channel.lastMessage.index-14) {
      // If last seen index was in the last page, just get the last page
      if (this.channel.lastMessage.index <= 15) {
        this.getMessages(0, 'forwards')
      } else {
        this.getMessages(this.channel.lastMessage.index-14, 'forwards')
      }
    } else {
      // Otherwise, get from the last seen page
      this.getMessages(lastSeenIndex, 'forwards')
    }
    

    this.channel.on('messageAdded', function (message) {
      that.messages.push(message)
      that.scrollToBottom()
    })
  }

  getTotalMessageCount () {
    var that = this
    this.channel.getMessagesCount().then(function (c) {
      if (c <= 15) {
        that.unreadMessageCount = 0
      } else {
        that.unreadMessageCount = c - 15
      }
      
    })
  }

  getUnconsumedMessageCount () {
    var that = this
    this.channel.getUnconsumedMessagesCount().then(function (c) {
      that.unreadMessageCount = c
    })
  }

  getMessages (fromIndex, direction) {
    var that = this

    that.channel.getMessages(that.pageSize, fromIndex, direction).then(function (messages) {
      if (messages.items.length > 0) {
        // Adding to the back of the array if we're scrolling up (lastPage)
        if (direction == 'backwards') {
          for (var i = messages.items.length-1; i >= 0; i--) {
            that.messages.unshift(messages.items[i])
          }
        } else {
          // Adding to the front of the array if we're scrolliing down (nextPage)
          for (var i = 0; i < messages.items.length; i++) {
            that.messages.push(messages.items[i])
            that.scrollToBottom()
          }
          // Updating the last seen message index
          that.channel.updateLastConsumedMessageIndex(messages.items[messages.items.length-1].index).then(function (c) {
            that.unreadMessageCount = c
          })
        }
      }
    })
  }

  private onScroll (e) {
    if (e.target.scrollTop === 0 && this.messages.length > 0) {
      const olderMessages = [];
      this.getMessages(this.messages[0].index-1, "backwards")
    } else if (e.target.scrollTop === e.target.scrollHeight - e.target.offsetHeight && this.messages.length > 0) {
      this.getMessages(this.messages[this.messages.length-1].index+1, "forward")
    }
  }

  private sendMessage (msg) {
    this.channel.sendMessage(msg)
  }

}
