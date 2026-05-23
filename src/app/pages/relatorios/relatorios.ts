import { Component } from '@angular/core';

import { MatCard, MatCardModule } from '@angular/material/card';

import { RelatorioEstudos } from '../../components/relatorio-estudos/relatorio-estudos';

@Component({
  selector: 'app-relatorios',
  imports: [
    MatCardModule,
    RelatorioEstudos
  ],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class Relatorios {}
