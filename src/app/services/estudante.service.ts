import { inject, Injectable, Signal, signal } from '@angular/core';
import { Estudante } from '../models/estudante.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/estudantes';

  private readonly estudantes = signal<Estudante[]>([]);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
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

    this.http.get<Estudante[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.estudantes.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os estudantes.');
        this.carregando.set(false);
      }
    });
  }

  buscarPorId(id: string): Estudante | undefined {
    return this.estudantes().find(estudante => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.post<Estudante>(this.apiUrl, estudante).subscribe({
      next: (novoEstudante) => {
        this.estudantes.update(listaAtual => [
          ...listaAtual,
          novoEstudante
        ]);

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar o estudante.');
        this.carregando.set(false);
      }
    });
  }

  editar(id: string, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.put<Estudante>(`${this.apiUrl}/${id}`, {
      id,
      ...estudanteAtualizado
    }).subscribe({
      next: (estudanteEditado) => {
        this.estudantes.update(listaAtual =>
          listaAtual.map(estudante =>
            estudante.id === id ? estudanteEditado : estudante
          )
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar o estudante.');
        this.carregando.set(false);
      }
    });
  }

  remover(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.estudantes.update(listaAtual =>
          listaAtual.filter(estudante => estudante.id !== id)
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover o estudante.');
        this.carregando.set(false);
      }
    });
  }
}
