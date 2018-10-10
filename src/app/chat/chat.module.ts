import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { 
  MatDatepickerModule, 
  MatNativeDateModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatButtonModule, 
  MatCardModule, 
  MatListModule, 
  MatDividerModule 
} from '@angular/material';
// import { ChatRoomComponent } from "./chat-room.component"
import { AuthGuard } from '../_guards/auth.guard';
import { ChatComponent } from './chat.component';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatService } from './chat.service';

const ChatRoutes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
  }
];

// const config: SocketIoConfig = { url: '127.0.0.1:8000', options: {path: '/ws/chat/'+localStorage.getItem('node')+'/',
// transports: ['websocket']} };


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ChatRoutes),
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    // SocketIoModule.forRoot(config)
  ],
  declarations: [
    ChatComponent,
  ],
  providers: [
    ChatService
  ],
  exports: [
    ChatComponent,
  ],
  bootstrap: [ChatComponent]
})
export class ChatModule { }