import { Component, signal } from '@angular/core';

import { Estudante } from '../../models/estudante.model';

@Component({
  selector: 'app-estudantes',
  imports: [],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css',
})
export class Estudantes {
  estudantes = signal<Estudante[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@email.com',
      curso: 'Angular Básico',
      turno: 'noturno'
    },
    {
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      curso: 'Frontend com Angular',
      turno: 'vespertino'
    },
    {
      id: 3,
      nome: 'Maria Oliveira',
      email: 'maria@email.com',
      curso: 'Backend com Node.js',
      turno: 'matutino'
    }
  ]);
}
