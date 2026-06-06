import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Estudantes } from './pages/estudantes/estudantes';
import { Tarefas } from './pages/tarefas/tarefas';
import { Relatorios } from './pages/relatorios/relatorios';
import { Sobre } from './pages/sobre/sobre';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth.guards';



export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'estudantes',
    component: Estudantes,
    canActivate: [authGuard],
  },
  {
    path: 'tarefas',
    component: Tarefas,
    canActivate: [authGuard],
  },
  {
    path: 'relatorios',
    component: Relatorios,
    canActivate: [authGuard],
  },
  {
    path: 'sobre',
    component: Sobre,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
