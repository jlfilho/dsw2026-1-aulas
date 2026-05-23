import { Component, input, output } from '@angular/core';
import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, JsonPipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-tarefa-card',
  imports: [
    DatePipe,
    JsonPipe,
    TitleCasePipe,
    UpperCasePipe,
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
  dataEntrega = input<Date>();

  editar = output<number>();
  remover = output<number>();

  dadosDebug = input<unknown>();

  aoClicarEditar(): void {
    this.editar.emit(this.id());
  }

  aoClicarRemover(): void {
    this.remover.emit(this.id());
  }

}
