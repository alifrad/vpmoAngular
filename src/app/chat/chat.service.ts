import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { BehaviorSubject } from 'rxjs/index';
import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';
import { LoadingService } from '../_services/loading.service';
import { CustomHttpClient } from '../_services/custom-http.service';

import { HttpErrorResponse } from '@angular/common/http/src/response';

declare const Twilio: any;

@Injectable()
export class ChatService {

  // url for crud operation of teamTree
  private readonly apiUrl: string = `${appConfig.chatUrl}`;
  private readonly tokenUrl: string = this.apiUrl + '/token/';

  constructor(
    private http: CustomHttpClient,
    private authUser: AuthenticationService,
    private loadingService: LoadingService
  ) {
    authUser.user.subscribe(user => {
      if (user !== null) {
        this.unreadMessageTracker.next({})
        this.userChannels.next([])
        this.unreadMessageTracker.next({})

        this.getChatClient(user)
      }
    })
  }

  public chatClient = new BehaviorSubject(null);
  public userChannels = new BehaviorSubject([]);
  public unreadMessageTracker = new BehaviorSubject({});
  // Chat component listens to this and adds to display if message is added on active channel
  public messages = new BehaviorSubject(null);

  // This is called whenever there is a new login
  getChatClient (user) {
    var that = this
    this.loadingService.show()

    this.getToken(user).subscribe(response => {
      var token = response.token
      Twilio.Chat.Client.create(token).then(client => {
        that.getUserChannels(client)
        that.chatClient.next(client)
        that.loadingService.hide()

        client.on('messageAdded', function(message) {
          var unreadMessages = that.unreadMessageTracker.value
          if (unreadMessages[message.channel.uniqueName] !== undefined) {
            unreadMessages[message.channel.uniqueName] = unreadMessages[message.channel.uniqueName] + 1
          }
          that.unreadMessageTracker.next(unreadMessages)
          that.messages.next(message)
        })

        client.on('channelAdded', function (channel) {
          that.channelAdded(channel)
        })

        client.on('channelJoined', function(channel) {
          that.channelAdded(channel)
        })

        // Add listener for client.on('tokenAboutToExpire', xx) 
        //  To update chat token when it's about to expire
      })
    })
  }

  getUserChannels (client) {
    var that = this

    client.getUserChannelDescriptors().then(function (channelDescriptors) {
      
      for (var i = 0; i < channelDescriptors.items.length; i++) {

        channelDescriptors.items[i].getChannel().then(function (channel) {
          that.channelAdded(channel)
        })
      }

    })
  }

  channelAdded (channel) {
    var that = this
    var userChannels = that.userChannels.value

    if (userChannels.filter(i => i.uniqueName == channel.uniqueName).length == 0) {
      that.userChannels.next(userChannels.concat([channel]))
    } else {
      userChannels[userChannels.indexOf(userChannels.filter(i => i.uniqueName == channel.uniqueName))] = channel
      that.userChannels.next(userChannels)
    }
    that.updateChannelUnread(channel)

  }

  updateChannelUnread (channel) {
    var that = this

    var unreadMessages = that.unreadMessageTracker.value

    channel.getUnconsumedMessagesCount().then(function (c) {
      if (c == null) {
        if (channel.lastMessage == undefined) {
          unreadMessages[channel.uniqueName] = 0
        } else {
          unreadMessages[channel.uniqueName] = channel.lastMessage.index+1
        }
      } else {
        unreadMessages[channel.uniqueName] = c
      }
      that.unreadMessageTracker.next(unreadMessages)
    })
  }


  getToken (user): Observable<any> {
    return this.http.get(this.tokenUrl)
  }
}