import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarefa-card',
  imports: [],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {
  nome = input.required<string>();
  status = input('Pendente');
}
