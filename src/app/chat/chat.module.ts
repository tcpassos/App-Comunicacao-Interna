import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChatComponent } from './chat.component';
import { ChatListaComponent } from './chat-lista.component';

@NgModule({
  declarations: [
    ChatComponent,
    ChatListaComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ChatModule { }
