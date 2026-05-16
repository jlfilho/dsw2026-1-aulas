import { Component, input, output } from '@angular/core';
import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tarefa-card',
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {
  id = input.required<number>();
  nome = input.required<string>();
  status = input<StatusTarefa>('pendente');
  prioridade = input.required<PrioridadeTarefa>();
  estudanteNome = input.required<string>();

  editar = output<number>();
  remover = output<number>();

  aoClicarEditar(): void {
    this.editar.emit(this.id());
  }

  aoClicarRemover(): void {
    this.remover.emit(this.id());
  }

}
