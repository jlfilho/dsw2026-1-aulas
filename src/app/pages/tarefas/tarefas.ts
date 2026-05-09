import { Component, signal } from '@angular/core';

import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-tarefas',
  imports: [],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas {
  tarefas = signal<Tarefa[]>([
    {
      id: 1,
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta'
    },
    {
      id: 2,
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media'
    }
  ]);
}
