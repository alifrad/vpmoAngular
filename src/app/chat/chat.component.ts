import { Component, OnInit, OnDestroy,
          ViewChild, AfterViewChecked, AfterViewInit,
          IterableDiffers, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthenticationService } from '../_services';
import { appConfig } from '../app.config';
import { Subscription } from 'rxjs';
import { NodeService } from '../node/node.service';
import { LoadingService } from '../_services/loading.service';

declare const Twilio: any

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, OnDestroy {

  @Input() nodeID: string;
  @Input() nodeType: string;

  constructor(
    private router: Router,
    private _chatService: ChatService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private nodeService: NodeService,
    differs: IterableDiffers,
    private loadingService: LoadingService
  ) {
    this.differ = differs.find([]).create(null);
  }

  @ViewChild('chatContainer') chatContainer;

  differ: any;
  messages: any[] = [];
  chatToken: string;
  chatClient: any;
  channel: any = null;
  currentUser: any;
  unreadMessageCount: any;
  pageSize: any = 15;
  currentUserPermissions: string[] = [];

  userSubscription: Subscription;
  clientSubscription: Subscription;
  messageSubscription: Subscription;
  permissionsSubscription: Subscription;

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
    this.userSubscription = this.authService.user.subscribe(user => {
      if (user) {
        this.currentUser = user
      } else {
        this.currentUser = ''
      }
    })
    
    this.clientSubscription = this._chatService.chatClient.subscribe(chatClient => {
      if (chatClient) {
        this.chatClient = chatClient
        var that = this
        this.chatClient.getSubscribedChannels().then(function (resp) {
          that.getChannel()
        })
      }
    })

    this.messageSubscription = this._chatService.messages.subscribe(message => {
      if (message) {
        this.messageAdded(message)
      }
    })

    this.permissionsSubscription = this.nodeService.userPermissions.subscribe(permissions => {
      if (permissions) {
        this.currentUserPermissions = permissions.permissions
        if (!this.canChat() && permissions.permissions.indexOf('update_'+this.nodeType.toLowerCase()) >= 0){
          this.getChannel()
        }
      }
    })
  }

  ngOnDestroy () {
    this.userSubscription.unsubscribe();
    this.clientSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.permissionsSubscription.unsubscribe();
  }

  canChat () {
    if (this.currentUserPermissions.indexOf('update_'+this.nodeType.toLowerCase()) >= 0) {
      return true
    } else {
      return false
    }
  }

  messageAdded (message) {
    if (this.channel != null && message.channel.sid == this.channel.sid) {
      if (this.messages.length == 0 || message.index == this.messages[this.messages.length-1].index+1) {
        this.messages.push(message)

        this.updateLastConsumed(message.index)

        this.scrollToBottom()
      }
    }
  }

  getChannel () {
    var taskID = this.loadingService.startTask()
    var that = this
    this.chatClient.getChannelByUniqueName(this.nodeID)
      .then(function (channel) {
        that.channel = channel
        that.setupChannel()
        that.loadingService.taskFinished(taskID)
      })
  }

  setupChannel () {
    var that = this
    var lastSeenIndex = this.channel.lastConsumedMessageIndex || 0
    var taskID = this.loadingService.startTask()

    if (lastSeenIndex == 0) {
      this.getTotalMessageCount()
    } else {
      this.getUnconsumedMessageCount()
    }

    // Getting messages forwards from the last seen message
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
    this.loadingService.taskFinished(taskID)
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
    var taskID = this.loadingService.startTask()
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
        }
        that.updateLastConsumed(that.messages[that.messages.length-1].index)
      }
      that.loadingService.taskFinished(taskID)
    })
  }

  updateLastConsumed(index) {
    var that = this
    that.channel.advanceLastConsumedMessageIndex(index).then(function (c) {
      that.unreadMessageCount = c
      that._chatService.updateChannelUnread(that.channel)
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
    this.channel.sendMessage(msg, {
      authorName: this.currentUser.fullname,
      authorAvatar: this.currentUser.avatar
    })
  }

  isLastMessageOfGroup(message, index) {
    return (index == this.messages.length-1 || this.messages[index+1] && this.messages[index+1].author != message.author)
  }

}
