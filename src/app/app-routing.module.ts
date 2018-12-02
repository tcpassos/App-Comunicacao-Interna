import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '',
    redirectTo: '/chat',
    pathMatch: 'full' },

  { path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard] },

  { path: 'login',
    component: LoginComponent },

  { path: 'cadastro',
    component: CadastroComponent },

  { path: 'perfil/:u',
  component: PerfilComponent },

  { path: '**', redirectTo: 'chat' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
