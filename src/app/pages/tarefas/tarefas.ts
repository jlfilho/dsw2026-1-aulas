import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
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
  private readonly dialog = inject(MatDialog);


  tarefas = this.tarefaService.listar();

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';

  idEmEdicao: number | null = null;

  salvarFormulario(): void {
    const dadosFormulario = {
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();
  }

  editarTarefaPorId(id: number): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
    }
  }

  removerTarefa(id: number): void {
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
  }

}
