import { Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly tarefas = signal<Tarefa[]>([
    {
      id: 1,
      estudanteId: 1,
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta',
      dataEntrega: '2023-10-15'
    },
    {
      id: 2,
      estudanteId: 1,
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media'
    },
    {
      id: 3,
      estudanteId: 2,
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
      estudanteId: tarefa.estudanteId,
      nome: tarefa.nome,
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      dataEntrega: tarefa.dataEntrega
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
            estudanteId: tarefaAtualizada.estudanteId,
            nome: tarefaAtualizada.nome,
            status: tarefaAtualizada.status,
            prioridade: tarefaAtualizada.prioridade,
            dataEntrega: tarefaAtualizada.dataEntrega
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
