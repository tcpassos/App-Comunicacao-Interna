import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from './../_models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    constructor(private http: HttpClient) { }

    listar() {
        return this.http.get<Usuario[]>('http://localhost:3000/list');
    }

    perfil(u: string) {
    	return this.http.get<Usuario>('http://localhost:3000/perfil?u=' + u);
    }

    cadastrar(usuario: Usuario) {
        return this.http.post('http://localhost:3000/cadastro', usuario);
    }
}
