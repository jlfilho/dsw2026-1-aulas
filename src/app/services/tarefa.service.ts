import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';

import { API_URL } from '../config/api.config';
import { PrioridadeTarefa, StatusTarefa, Tarefa } from '../models/tarefa.model';

type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

type TarefaApi = {
  id: number;
  estudanteId: number;
  estudanteNome: string;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega: string;
};

type TarefaRequest = {
  estudanteId: number;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega: string;
};

type OpcoesListagemTarefas = {
  pagina: number;
  tamanho: number;
  ordenarPor?: string;
  direcao?: 'asc' | 'desc' | '';
  estudanteId?: number | null;
  status?: StatusTarefa | null;
  prioridade?: PrioridadeTarefa | null;
};

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/tarefas`;

  private readonly tarefas = signal<Tarefa[]>([]);
  private readonly total = signal(0);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  totalRegistros(): Signal<number> {
    return this.total.asReadonly();
  }

  estaCarregando(): Signal<boolean> {
    return this.carregando.asReadonly();
  }

  mensagemErro(): Signal<string | null> {
    return this.erro.asReadonly();
  }

  carregar(): void {
    this.listarPaginado({
      pagina: 0,
      tamanho: 5,
    });
  }

  listarPaginado(opcoes: OpcoesListagemTarefas): void {
    this.carregando.set(true);
    this.erro.set(null);

    let params = new HttpParams().set('page', opcoes.pagina).set('size', opcoes.tamanho);

    if (opcoes.ordenarPor && opcoes.direcao) {
      params = params.set('sort', `${opcoes.ordenarPor},${opcoes.direcao}`);
    }

    if (opcoes.estudanteId) {
      params = params.set('estudanteId', opcoes.estudanteId);
    }

    if (opcoes.status) {
      params = params.set('status', opcoes.status);
    }

    if (opcoes.prioridade) {
      params = params.set('prioridade', opcoes.prioridade);
    }

    this.http.get<SpringPage<TarefaApi>>(this.apiUrl, { params }).subscribe({
      next: (resposta) => {
        const tarefasConvertidas = resposta.content.map((tarefa) => this.converterDaApi(tarefa));

        this.tarefas.set(tarefasConvertidas);
        this.total.set(resposta.totalElements);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as tarefas.');
        this.tarefas.set([]);
        this.total.set(0);
        this.carregando.set(false);
      },
    });
  }

  buscarPorId(id: number): Tarefa | undefined {
    return this.tarefas().find((tarefa) => tarefa.id === id);
  }

  cadastrar(tarefa: Omit<Tarefa, 'id' | 'estudanteNome'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    const tarefaApi = this.converterParaApi(tarefa);

    this.http.post<TarefaApi>(this.apiUrl, tarefaApi).subscribe({
      next: (novaTarefa) => {
        this.tarefas.update((listaAtual) => [...listaAtual, this.converterDaApi(novaTarefa)]);

        this.total.update((valorAtual) => valorAtual + 1);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar a tarefa.');
        this.carregando.set(false);
      },
    });
  }

  editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id' | 'estudanteNome'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    const tarefaApi = this.converterParaApi(tarefaAtualizada);

    this.http.put<TarefaApi>(`${this.apiUrl}/${id}`, tarefaApi).subscribe({
      next: (tarefaEditada) => {
        this.tarefas.update((listaAtual) =>
          listaAtual.map((tarefa) =>
            tarefa.id === id ? this.converterDaApi(tarefaEditada) : tarefa,
          ),
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar a tarefa.');
        this.carregando.set(false);
      },
    });
  }

  remover(id: number): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.tarefas.update((listaAtual) => listaAtual.filter((tarefa) => tarefa.id !== id));

        this.total.update((valorAtual) => Math.max(0, valorAtual - 1));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(
          'Não foi possível remover a tarefa. Verifique se o usuário tem perfil ADMIN.',
        );
        this.carregando.set(false);
      },
    });
  }

  private converterDaApi(tarefa: TarefaApi): Tarefa {
    return {
      id: tarefa.id,
      estudanteId: tarefa.estudanteId,
      estudanteNome: tarefa.estudanteNome,
      nome: tarefa.nome,
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      dataEntrega: new Date(tarefa.dataEntrega),
    };
  }

  private converterParaApi(tarefa: Omit<Tarefa, 'id' | 'estudanteNome'>): TarefaRequest {
    return {
      estudanteId: tarefa.estudanteId,
      nome: tarefa.nome,
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      dataEntrega: this.formatarDataParaApi(tarefa.dataEntrega),
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
