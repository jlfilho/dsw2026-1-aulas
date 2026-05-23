import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TarefaService } from '../../services/tarefa.service';
import { PrioridadeTarefa, StatusTarefa, Tarefa } from '../../models/tarefa.model';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { EstudanteService } from '../../services/estudante.service';
import { DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas {
  private readonly tarefaService = inject(TarefaService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
  estudanteSelecionadoId = signal<string | null>(null);
  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();


  tarefasFiltradas = computed(() => {
    let lista = this.tarefas();

    if (this.estudanteSelecionadoId() !== null) {
      lista = lista.filter(t => t.estudanteId === this.estudanteSelecionadoId());
    }

    switch (this.filtroSelecionado()) {
      case 'pendente':
        return lista.filter((t) => t.status === 'pendente');

      case 'concluida':
        return lista.filter((t) => t.status === 'concluida');

      case 'alta':
        return lista.filter((t) => t.prioridade === 'alta');

      default:
        return lista;
    }
  });

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';
  novoEstudanteId: string | null = null;
  novaDataEntrega?: Date | null = null;

  idEmEdicao: string | null = null;

  salvarFormulario(): void {
    const dadosFormulario = {
      nome: this.novoNome,
      estudanteId: this.novoEstudanteId ?? '0',
      status: this.novoStatus,
      prioridade: this.novaPrioridade,
      dataEntrega: this.novaDataEntrega ?? undefined
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();
  }

  editarTarefaPorId(id: string): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoEstudanteId = tarefa.estudanteId;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
      this.novaDataEntrega = tarefa.dataEntrega ? new Date(tarefa.dataEntrega) : null;
    }
  }

  removerTarefa(id: string): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: string | undefined) => {
      if (confirmou === 'true') {
        this.tarefaService.remover(id);

        if (this.idEmEdicao === id) {
          this.limparFormulario();
        }
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  private limparFormulario(): void {
    this.idEmEdicao = null;
    this.novoNome = '';
    this.novoStatus = 'pendente';
    this.novaPrioridade = 'media';
    this.novoEstudanteId = null;
    this.novaDataEntrega = null;
  }

  buscarNomeEstudante(id: string): string {
    const estudante = this.estudanteService.buscarPorId(id);
    return estudante ? estudante.nome : 'Não encontrado';
  }

}
