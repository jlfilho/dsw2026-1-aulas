import { Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly tarefas = signal<Tarefa[]>([
    {
      id: "1",
      estudanteId: "1",
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta',
      dataEntrega: new Date('2024-06-30')
    },
    {
      id: "2",
      estudanteId: "1",
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media',
      dataEntrega: new Date('2024-07-15')
    },
    {
      id: "3",
      estudanteId: "2",
      nome: 'Implementar sistema de autenticação',
      status: 'concluida',
      prioridade: 'baixa',
      dataEntrega: new Date('2024-08-01')
    }
  ]);

  private proximoId = "4";

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  buscarPorId(id: string): Tarefa | undefined {
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

    this.proximoId;
  }

  editar(id: string, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
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

  remover(id: string): void {
    this.tarefas.update(listaAtual =>
      listaAtual.filter(tarefa => tarefa.id !== id)
    );
  }
}
