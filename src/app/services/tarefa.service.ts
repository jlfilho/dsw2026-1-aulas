import { Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly tarefas = signal<Tarefa[]>([
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
    },
    {
      id: 3,
      nome: 'Implementar sistema de autenticação',
      status: 'concluida',
      prioridade: 'baixa'
    }
  ]);

  private proximoId = 4;

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  buscarPorId(id: number): Tarefa | undefined {
    return this.tarefas().find(tarefa => tarefa.id === id);
  }

  cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
    const novaTarefa: Tarefa = {
      id: this.proximoId,
      nome: tarefa.nome,
      status: tarefa.status,
      prioridade: tarefa.prioridade
    };

    this.tarefas.update(listaAtual => [
      ...listaAtual,
      novaTarefa
    ]);

    this.proximoId++;
  }

  editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.tarefas.update(listaAtual =>
      listaAtual.map(tarefa =>
        tarefa.id === id
          ? {
            id,
            nome: tarefaAtualizada.nome,
            status: tarefaAtualizada.status,
            prioridade: tarefaAtualizada.prioridade
          }
          : tarefa
      )
    );
  }

  remover(id: number): void {
    this.tarefas.update(listaAtual =>
      listaAtual.filter(tarefa => tarefa.id !== id)
    );
  }
}
