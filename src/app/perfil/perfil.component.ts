import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Usuario } from './../_models/usuario';
import { UsuarioService } from '../_services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {

  private sub: any;
  u: string;

  usuario: Usuario = new Usuario;
  perfil: string;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
    ) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe( param => {
  		this.u = param['u'];
  	});

    // carrega o usuario solicitado
    this.usuarioService.perfil(this.u).subscribe((usuario) => {
        this.usuario = usuario;
        if (usuario.perfil == 'U') {
          this.perfil = 'Usuário padrão';
        } else if(usuario.perfil == 'A') {
          this.perfil = 'Administrador';
        }
    });
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  }

}
