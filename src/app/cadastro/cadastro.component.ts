import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from './../_services/alert.service';
import { UsuarioService } from './../_services/usuario.service';
import { AuthService } from './../_services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  formularioCadastro: FormGroup;
  carregando = false;
  enviado = false;

  // opção de criar usuarios admin
  admin = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private alertService: AlertService
  ) {
     // Caso logado e com perfil padrao, o usuario e redirecionado para o chat
     if (this.authService.usuarioAtualDados) {
       if (this.authService.usuarioAtualDados.perfil == 'A') {
         this.admin = true;
       } else {
         this.router.navigate(['/']);
       }
     }
  }

  ngOnInit() {
    this.formularioCadastro = this.formBuilder.group({
        nome: ['', Validators.required],
        login: ['', Validators.required],
        nascimento: '',
        senha: ['', [Validators.required, Validators.minLength(5)] ],
        perfil: ['U', Validators.required]
    });
  }

  get f() { return this.formularioCadastro.controls; }

  onSubmit() {
    this.enviado = true;

    // Em caso de formulario invalido, cancelar
    if (this.formularioCadastro.invalid) {
        return;
    }

    this.carregando = true;
    this.usuarioService.cadastrar(this.formularioCadastro.value)
        .pipe(first())
        .subscribe(
            data => {
                this.alertService.sucesso('Cadastro realizado com sucesso!', true);
                this.router.navigate(['/login']);
            },
            erro => {
                this.alertService.erro(erro);
                this.carregando = false;
            });
  }
}
