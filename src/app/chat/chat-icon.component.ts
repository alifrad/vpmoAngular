import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chat-icon',
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.less']
})
export class ChatIconComponent {
  @Input()
  unreadMessages;


}
