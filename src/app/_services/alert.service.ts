import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private manterMensagem = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.manterMensagem) {
                    this.manterMensagem = false;
                } else {
                    this.subject.next();
                }
            }
        });
    }

    sucesso(mensagem: string, manterMensagem = false) {
        this.manterMensagem = manterMensagem;
        this.subject.next({ tipo: 'sucesso', texto: mensagem });
    }

    erro(mensagem: string, manterMensagem = false) {
        this.manterMensagem = manterMensagem;
        this.subject.next({ tipo: 'erro', texto: mensagem });
    }

    getMensagem(): Observable<any> {
        return this.subject.asObservable();
    }
}
