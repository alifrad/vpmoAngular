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

import { AuthGuard } from '../_guards/auth.guard';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';

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