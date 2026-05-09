import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Estudantes } from './pages/estudantes/estudantes';
import { Tarefas } from './pages/tarefas/tarefas';
import { Relatorios } from './pages/relatorios/relatorios';
import { Sobre } from './pages/sobre/sobre';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'estudantes', component: Estudantes },
  { path: 'tarefas', component: Tarefas },
  { path: 'relatorios', component: Relatorios },
  { path: 'sobre', component: Sobre },
  { path: '**', redirectTo: '' }
];
