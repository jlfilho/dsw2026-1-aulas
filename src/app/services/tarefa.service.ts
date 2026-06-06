import { inject, Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';
import { HttpClient } from '@angular/common/http';


type TarefaApi = Omit<Tarefa, 'dataEntrega'> & {
  dataEntrega: string;
};
@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly tarefas = signal<Tarefa[]>([]);
  private readonly apiUrl = 'http://localhost:3000/tarefas';
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);


  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  estaCarregando(): Signal<boolean> {
    return this.carregando.asReadonly();
  }

  mensagemErro(): Signal<string | null> {
    return this.erro.asReadonly();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<Tarefa[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.tarefas.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as tarefas.');
        this.carregando.set(false);
      }
    });
  }

  buscarPorId(id: string): Tarefa | undefined {
    return this.tarefas().find(tarefa => tarefa.id === id);
  }

  cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.post<Tarefa>(this.apiUrl, tarefa).subscribe({
      next: (novaTarefa) => {
        this.tarefas.update(listaAtual => [
          ...listaAtual,
          novaTarefa
        ]);

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar a tarefa.');
        this.carregando.set(false);
      }
    });
  }

  editar(id: string, tarefaAtualizado: Omit<Tarefa, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.put<Tarefa>(`${this.apiUrl}/${id}`, {
      id,
      ...tarefaAtualizado
    }).subscribe({
      next: (tarefaEditada) => {
        this.tarefas.update(listaAtual =>
          listaAtual.map(tarefa =>
            tarefa.id === id ? tarefaEditada : tarefa
          )
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar a tarefa.');
        this.carregando.set(false);
      }
    });
  }

  remover(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.tarefas.update(listaAtual =>
          listaAtual.filter(tarefa => tarefa.id !== id)
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover a tarefa.');
        this.carregando.set(false);
      }
    });
  }

  private converterDaApi(tarefa: TarefaApi): Tarefa {
    return {
      ...tarefa,
      dataEntrega: new Date(tarefa.dataEntrega)
    };
  }

  private converterParaApi(tarefa: Omit<Tarefa, 'id'>): Omit<TarefaApi, 'id'> {
    return {
      ...tarefa,
      dataEntrega: this.formatarDataParaApi(tarefa.dataEntrega)
    };
  }

  private formatarDataParaApi(data?: Date): string {
    if (!data) {
      return '';
    }
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }


}
