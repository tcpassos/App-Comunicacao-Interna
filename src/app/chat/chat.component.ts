import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { Usuario } from './../_models/usuario';
import { Mensagem } from './../_models/mensagem';
import { UsuarioService } from '../_services/usuario.service';
import { AuthService } from './../_services/auth.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('chatMensagens') chatMensagens;

  usuarioAtual: Usuario;
  usuarioConversa: Usuario = new Usuario;
  usuarioSub: Subscription;
  mostrarInput = false;

  handlerMensagens: any;
  mensagens: Mensagem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private usuarioService: UsuarioService
  ) {
    // define o usuario logado
    this.usuarioSub = this.authService.usuarioAtual.subscribe(usuario => {
        this.usuarioAtual = usuario;
    });

    // conecta com o websocket e envia o id do usuario
    this.chatService.conectar(this.usuarioAtual.id);
  }

  ngOnInit() {
    // escuta as mensagens recebidas do servidor
    this.handlerMensagens = this.chatService.onMensagem()
      .subscribe((msg: Mensagem) => {
        // caso a mensagem recebida for do usuario da conversa atual
        if (this.usuarioConversa.id == msg.origem) {
          this.addMensagem(msg);
        } else {
          this.chatService.solicitarConversas(this.usuarioAtual);
        }
      });
    }

  ngOnDestroy() {
    this.usuarioSub.unsubscribe();
  }

  private logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onUsuarioSelecionado(usuario) {
    if(this.usuarioConversa == usuario) return;

    this.usuarioConversa = usuario;
    this.chatService.carregarMensagens(this.usuarioAtual, this.usuarioConversa)
    .pipe(first()).subscribe(mensagens => {this.mensagens = mensagens;});
    this.mostrarInput = true;
  }


  // mensagens ----------------------------------

  enviarMensagem(msg) {
    if (!msg.value) { return; }

    const mensagem = {
      origem: this.usuarioAtual.id,
      destino: this.usuarioConversa.id,
      texto: msg.value
    };

    this.addMensagem(mensagem);
    this.chatService.enviarMensagem(mensagem);

    // posiciona a conversa no inicio da lista
    this.chatService.solicitarConversas(this.usuarioAtual);

    msg.value = '';
  }


  scroll = () => {
    try {
      this.chatMensagens.nativeElement.scrollTop = this.chatMensagens.nativeElement.scrollHeight;
    } catch (err) {}
  }

  addMensagem(msg: Mensagem) {
    this.mensagens.push(msg);
    this.scroll();
  }

}
