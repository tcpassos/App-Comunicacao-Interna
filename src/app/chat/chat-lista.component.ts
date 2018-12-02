import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';

import { Usuario } from './../_models/usuario';
import { UsuarioService } from '../_services/usuario.service';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-chat-lista',
  templateUrl: './chat-lista.component.html'
})
export class ChatListaComponent implements OnInit {

  @Input() usuarioAtual: Usuario;
  @Input() chatService: ChatService;
  @Output() usuarioSelecionado = new EventEmitter();

  usuarios: Usuario[] = [];
  usuariosLista: Usuario[] = [];
  conversas: number[];
  handlerConversas: any;
  indiceUsuario: number;
  titulo: string = 'Conversas';
  novaConversaStatus = false;
  usuariosCarregados = false;
  iniciou = false;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    // atualiza a lista de usuarios
    this.carregarUsuarios();

    this.handlerConversas = this.chatService.atualizarConversas()
      .subscribe((conversas: number[]) => {
        this.atualizarConversas(conversas);
    });
  }

  // atualiza a lista de conversas
  atualizarConversas(conversas: number[]){
    this.conversas = conversas;
    this.usuariosLista = [];

    for(let i = 0; i < conversas.length; i++) {
      let indice = this.usuarios.map(e => e.id).indexOf(conversas[i]);
      this.usuariosLista.push(this.usuarios[indice]);
    }

    // inicia a primeira conversa da lista, se existir
    if(this.usuariosLista.length > 0 && !this.iniciou) {
      this.usuarioSelecionado.emit(this.usuariosLista[0]);
      this.indiceUsuario = 0;
      this.iniciou = true;
    }
  }

  novaConversa(status: boolean) {
    if(!this.usuariosCarregados) return;
    this.novaConversaStatus = status;

    if(status) {
      this.titulo = 'Nova Conversa';
      this.usuariosLista = this.usuarios;
    } else {
      this.titulo = 'Conversas';
      this.atualizarConversas(this.conversas);
    }
  }

  private carregarUsuarios() {
    this.usuarioService.listar().pipe(first()).subscribe(usuarios => {
        this.usuarios = usuarios;

        // remove o usuario logado da lista de contatos
        for (let i = 0; i < usuarios.length; i++) {
          if (usuarios[i].nome === this.usuarioAtual.nome) {
            usuarios.splice(i, 1);
          }
        }

        this.usuariosCarregados = true;
        
        // atualiza a lista de conversas
        this.chatService.solicitarConversas(this.usuarioAtual);
    });
  }

  onUsuarioSelecionado(id_usuario, indice) {
    // envia o objeto do usuario selecionado para o componente pai
    for (let i = 0; i < this.usuarios.length; i++) {
      if ( this.usuarios[i].id === Number(id_usuario) ) {
        this.usuarioSelecionado.emit(this.usuarios[i]);
        break;
      }
    }
    
    this.indiceUsuario = indice;
    if(this.novaConversaStatus && !this.conversas.includes(Number(id_usuario))){
      this.conversas.unshift(Number(id_usuario));
    }
    this.novaConversa(false);
  }

}
