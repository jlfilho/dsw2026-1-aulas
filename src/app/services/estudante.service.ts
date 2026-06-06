import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';

import { API_URL } from '../config/api.config';
import { Estudante } from '../models/estudante.model';

type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

type OpcoesListagem = {
  pagina: number;
  tamanho: number;
  ordenarPor?: string;
  direcao?: 'asc' | 'desc' | '';
};

@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/estudantes`;

  private readonly estudantes = signal<Estudante[]>([]);
  private readonly total = signal(0);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
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

  listarPaginado(opcoes: OpcoesListagem): void {
    this.carregando.set(true);
    this.erro.set(null);

    let params = new HttpParams().set('page', opcoes.pagina).set('size', opcoes.tamanho);

    if (opcoes.ordenarPor && opcoes.direcao) {
      params = params.set('sort', `${opcoes.ordenarPor},${opcoes.direcao}`);
    }

    this.http.get<SpringPage<Estudante>>(this.apiUrl, { params }).subscribe({
      next: (resposta) => {
        this.estudantes.set(resposta.content);
        this.total.set(resposta.totalElements);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os estudantes.');
        this.estudantes.set([]);
        this.total.set(0);
        this.carregando.set(false);
      },
    });
  }

  buscarPorId(id: number): Estudante | undefined {
    return this.estudantes().find((estudante) => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.post<Estudante>(this.apiUrl, estudante).subscribe({
      next: (novoEstudante) => {
        this.estudantes.update((listaAtual) => [...listaAtual, novoEstudante]);

        this.total.update((valorAtual) => valorAtual + 1);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar o estudante.');
        this.carregando.set(false);
      },
    });
  }

  editar(id: number, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.put<Estudante>(`${this.apiUrl}/${id}`, estudanteAtualizado).subscribe({
      next: (estudanteEditado) => {
        this.estudantes.update((listaAtual) =>
          listaAtual.map((estudante) => (estudante.id === id ? estudanteEditado : estudante)),
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar o estudante.');
        this.carregando.set(false);
      },
    });
  }

  remover(id: number): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.estudantes.update((listaAtual) =>
          listaAtual.filter((estudante) => estudante.id !== id),
        );

        this.total.update((valorAtual) => Math.max(0, valorAtual - 1));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(
          'Não foi possível remover o estudante. Verifique se o usuário tem perfil ADMIN.',
        );
        this.carregando.set(false);
      },
    });
  }
}
