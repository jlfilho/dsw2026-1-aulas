import { Component, computed, inject, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { TarefaService } from '../../services/tarefa.service';
import { EstudanteService } from '../../services/estudante.service';

@Component({
  selector: 'app-relatorio-estudos',
  imports: [
    MatCardModule,
    MatTableModule
  ],
  templateUrl: './relatorio-estudos.html',
  styleUrl: './relatorio-estudos.css',
})
export class RelatorioEstudos implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly estudanteService = inject(EstudanteService);

  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  colunasPorPrioridade = ['prioridade', 'quantidade'];
  colunasPorEstudante = ['estudante', 'quantidade'];

  totalEstudantes = computed(() => this.estudantes().length);

  totalTarefas = computed(() => this.tarefas().length);

  totalPendentes = computed(() =>
    this.tarefas().filter(tarefa => tarefa.status === 'pendente').length
  );

  totalConcluidas = computed(() =>
    this.tarefas().filter(tarefa => tarefa.status === 'concluida').length
  );

  tarefasPorPrioridade = computed(() => {
    const baixa = this.tarefas().filter(tarefa => tarefa.prioridade === 'baixa').length;
    const media = this.tarefas().filter(tarefa => tarefa.prioridade === 'media').length;
    const alta = this.tarefas().filter(tarefa => tarefa.prioridade === 'alta').length;

    return [
      { prioridade: 'Baixa', quantidade: baixa },
      { prioridade: 'Média', quantidade: media },
      { prioridade: 'Alta', quantidade: alta }
    ];
  });

  tarefasPorEstudante = computed(() => {
    return this.estudantes().map(estudante => ({
      estudante: estudante.nome,
      quantidade: this.tarefas().filter(
        tarefa => tarefa.estudanteId === estudante.id
      ).length
    }));
  });

  ngOnInit() {
    this.tarefaService.carregar();
    this.estudanteService.carregar();
  }
}
