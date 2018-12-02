import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from './../_services/alert.service';
import { AuthService } from './../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formularioLogin: FormGroup;
  carregando = false;
  enviado = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    // caso o usuario esteja logado, e redirecionado para o chat
    if (this.authService.usuarioAtualDados) {
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.formularioLogin = this.formBuilder.group({
        login: ['', Validators.required],
        senha: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.formularioLogin.controls; }

  onSubmit() {
      this.enviado = true;

      // Validacao do formulario com Validators
      if (this.formularioLogin.invalid) {
          return;
      }

      this.carregando = true;
      this.authService.login(this.f.login.value, this.f.senha.value)
          .pipe(first())
          .subscribe(
              dados => {
                  this.router.navigate([this.returnUrl]);
              },
              erro => {
                  console.log(erro);
                  this.alertService.erro('Login e/ou senha incorretos.');
                  this.carregando = false;
              });
  }

}
