import { Component, computed, signal } from '@angular/core';
import { TarefaCard } from './tarefa-card/tarefa-card';

type Tarefa = {
  id: number;
  nome: string;
  status: string;
}

@Component({
  selector: 'app-root',
  imports: [TarefaCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noturno');

  quantidadeTarefas = computed(() => this.tarefas().length);

  mensagemResumo = computed(() => {
    return `${this.estudante()} está cursando ${this.curso()} no turno ${this.turno()} e tem ${this.quantidadeTarefas()} tarefas.`;
  });

  tarefas = signal<Tarefa[]> ([
    { id: 1, nome: 'Estudar Angular', status: 'Pendente' },
    { id: 2, nome: 'Fazer exercícios', status: 'Pendente' },
    { id: 3, nome: 'Revisar conceitos', status: 'Pendente' },
    { id: 4, nome: 'Fluxo de controle Template @for', status: 'Em andamento' },
    { id: 5, nome: 'Fluxo de controle Template @if', status: 'Pendente' }
  ]);

  imagemAngular = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';
  botaoRemoverDesabilitado = computed(() => this.quantidadeTarefas() === 0);

  alterarEstudante() {
    this.estudante.set('João');
  }

  alterarCurso() {
    this.curso.set('Angular avançado');
  }

  alterarTurno() {
    this.turno.set('Matutino');
  }

  adicionarTarefa() {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      nome: 'Nova tarefa',
      status: 'Pendente'
    };
    this.tarefas.update(tarefas => [...tarefas, novaTarefa]);
  }

  removerTarefa() {
    this.tarefas.update(tarefas => tarefas.slice(0, -1));
  }



}
