import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from './../_services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    mensagem: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMensagem().subscribe(mensagem => {
            this.mensagem = mensagem;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
