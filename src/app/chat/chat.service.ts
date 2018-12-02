import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Mensagem } from './../_models/mensagem';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: SocketIOClient.Socket;

  constructor(
    private http: HttpClient
  ) { }

  conectar(id_usuario) {
    this.socket = io( 'http://localhost:3000', {query: 'id=' + id_usuario} );
  }


  carregarMensagens(usuarioAtual, usuarioConversa) {
      return this.http.post<Mensagem[]>('http://localhost:3000/mensagens',
                                          {usuarioAtual, usuarioConversa});
  }

  enviarMensagem(msg: Mensagem) {
    return this.socket.emit('mensagem', msg);
  }

  atualizarConversas(): Observable<number[]> {
    return new Observable<number[]>(observer => {
      this.socket.on('conversas', (data: number[]) => { observer.next(data); } );
    });
  }

  solicitarConversas(usuario) {
    this.socket.emit('conversas', usuario);
  }

  onMensagem(): Observable<Mensagem> {
    return new Observable<Mensagem>(observer => {
      this.socket.on('mensagem', (data: Mensagem) => observer.next(data));
    });
  }

}
