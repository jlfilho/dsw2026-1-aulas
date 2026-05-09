import { Injectable, Signal, signal } from '@angular/core';
import { Estudante } from '../models/estudante.model';

@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
    private readonly estudantes = signal<Estudante[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@email.com',
      curso: 'Angular Básico',
      turno: 'noturno',
      dataIngresso: '2026-04-01'
    },
    {
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      curso: 'Frontend com Angular',
      turno: 'vespertino',
      dataIngresso: '2026-04-10'
    }
  ]);

  private proximoId = 3;

  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
  }

  buscarPorId(id: number): Estudante | undefined {
    return this.estudantes().find(estudante => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    const novoEstudante: Estudante = {
      id: this.proximoId,
      nome: estudante.nome,
      email: estudante.email,
      curso: estudante.curso,
      turno: estudante.turno,
      dataIngresso: estudante.dataIngresso
    };

    this.estudantes.update(listaAtual => [
      ...listaAtual,
      novoEstudante
    ]);

    this.proximoId++;
  }

  editar(id: number, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.estudantes.update(listaAtual =>
      listaAtual.map(estudante =>
        estudante.id === id
          ? {
              id,
              nome: estudanteAtualizado.nome,
              email: estudanteAtualizado.email,
              curso: estudanteAtualizado.curso,
              turno: estudanteAtualizado.turno,
              dataIngresso: estudanteAtualizado.dataIngresso
            }
          : estudante
      )
    );
  }

  remover(id: number): void {
    this.estudantes.update(listaAtual =>
      listaAtual.filter(estudante => estudante.id !== id)
    );
  }
}
