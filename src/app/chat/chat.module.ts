import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { QuillModule } from 'ngx-quill';

import { 
  MatDatepickerModule, 
  MatNativeDateModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatButtonModule, 
  MatCardModule, 
  MatListModule, 
  MatDividerModule,
  MatMenuModule,
  MatRadioModule,
  MatBottomSheetModule,
  MatBadgeModule
} from '@angular/material';

import { AuthGuard } from '../_guards/auth.guard';
import { ChatComponent } from './chat.component';
import { UnreadMessagesPanelComponent } from './unread-messages-panel.component';
import { ChatService } from './chat.service';
import { FuseSharedModule } from '../../@fuse/shared.module';
import { ChatIconComponent } from './chat-icon.component';

const ChatRoutes: Routes = [
  {
    path: 'chat/:type/:id',
    component: ChatComponent
  }
];


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
    MatMenuModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatBadgeModule,

    FuseSharedModule,

    QuillModule
  ],
  declarations: [
    ChatComponent,
    UnreadMessagesPanelComponent,
    ChatIconComponent
  ],
  providers: [
    ChatService
  ],
  exports: [
    ChatComponent,
  ],
  entryComponents: [
    UnreadMessagesPanelComponent
  ],
  bootstrap: [ChatComponent]
})
export class ChatModule { }