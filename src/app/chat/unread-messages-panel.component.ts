import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { ChatService } from './chat.service';

import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'unread-messages-panel',
  templateUrl: './unread-messages-panel.component.html',
  styleUrls: ['./unread-messages-panel.component.scss']
})

export class UnreadMessagesPanelComponent implements OnInit, OnDestroy {
  /* A component to show the distribution of unreadMessages for the given node and its children
   * (Uses the child_nodes attribute from the Project and Team serializers)
   */

  _unsubscribeAll: Subject<any>;

  unreadMessages: any;

  constructor(
    private _chatService: ChatService,
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<UnreadMessagesPanelComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this._unsubscribeAll = new Subject();
  }

  node: any = {};

  ngOnInit () {
    this.node = this.data.node

    this._chatService.unreadMessageTracker
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(unreadMessages => {
        this.unreadMessages = unreadMessages
      })
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  routeToNode (nodeID, nodeType) {
    this.router.navigate(['node/' + nodeType + '/' + nodeID + '/details']);
    this.bottomSheetRef.dismiss();
  }
  
}
