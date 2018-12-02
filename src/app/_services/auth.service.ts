import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Usuario } from './../_models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private usuarioAtualSubject: BehaviorSubject<Usuario>;
    public usuarioAtual: Observable<Usuario>;

    constructor(private http: HttpClient) {
        this.usuarioAtualSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('usuarioAtual')));
        this.usuarioAtual = this.usuarioAtualSubject.asObservable();
    }

    public get usuarioAtualDados(): Usuario {
        return this.usuarioAtualSubject.value;
    }

    login(login: string, senha: string) {
        return this.http.post<any>('http://localhost:3000/login', { login, senha })
            .pipe(map(usuario => {

                if (usuario && usuario.token) {
                    // salva o usuario no cache para logar automaticamente
                    localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
                    this.usuarioAtualSubject.next(usuario);
                }

                return usuario;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('usuarioAtual');
        this.usuarioAtualSubject.next(null);
    }
}