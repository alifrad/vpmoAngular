import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatCardModule, MatListModule } from '@angular/material';
// import { ChatRoomComponent } from "./chat-room.component"
import { AuthGuard } from '../_guards/auth.guard';
import { ChatComponent } from './chat.component';

const ChatRoutes: Routes = [
  {
    path: 'chat',
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
  ],
  declarations: [
    ChatComponent,
  ],
  providers: [
  ],
})
export class ChatModule { }