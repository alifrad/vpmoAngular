import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from './chat.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material';
import { UnreadMessagesPanelComponent } from './unread-messages-panel.component';

@Component({
  selector: 'chat-unread-messages',
  templateUrl: './unread-messages.component.html',
  styleUrls: ['./unread-messages.component.less']
})
export class UnreadMessagesComponent implements OnInit {
  @Input()
  nodeId;
  

  
  private _unsubscribeAll: Subject<any>;

  unreadMessages: any;

  
  constructor(
    private _chatService: ChatService,
    private bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit() {
    this._chatService.unreadMessageTracker
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(unreadMessages => {
        this.unreadMessages = unreadMessages
    })

    

  }
  
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }


  openUnreadMessagesPanel(node) {
    const bottomSheetRef = this.bottomSheet.open(UnreadMessagesPanelComponent, {
      data: { node: node },
    });
  }

}
