import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';
import { EstudanteService } from '../../services/estudante.service';
import { TarefaService } from '../../services/tarefa.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  carregandoTarefas = this.tarefaService.estaCarregando();
  erroTarefas = this.tarefaService.mensagemErro();

  carregandoEstudantes = this.estudanteService.estaCarregando();
  erroEstudantes = this.estudanteService.mensagemErro();

  totalRegistrosTarefas = this.tarefaService.totalRegistros();

  paginaAtual = 0;
  tamanhoPagina = 5;

  busca = new FormControl('', {
    nonNullable: true,
  });

  termoBusca = signal('');

  filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');

  novoNome = '';
  novoStatus: StatusTarefa = 'PENDENTE';
  novaPrioridade: PrioridadeTarefa = 'MEDIA';
  novoEstudanteId: number | null = null;
  novaDataEntrega: Date | null = null;

  filtroStatus = signal<StatusTarefa | null>(null);
  filtroPrioridade = signal<PrioridadeTarefa | null>(null);
  estudanteSelecionadoId = signal<number | null>(null);


  idEmEdicao: number | null = null;

  tarefasFiltradas = computed(() => {
    let lista = this.tarefas();

    const termo = this.termoBusca().toLowerCase().trim();

    if (termo) {
      lista = lista.filter((tarefa) => {
        const estudanteNome = this.buscarNomeEstudante(tarefa.estudanteId);

        return (
          tarefa.nome.toLowerCase().includes(termo) ||
          tarefa.status.toLowerCase().includes(termo) ||
          tarefa.prioridade.toLowerCase().includes(termo) ||
          estudanteNome.toLowerCase().includes(termo)
        );
      });
    }

    if (this.estudanteSelecionadoId() !== null) {
      lista = lista.filter(
        (tarefa) => tarefa.estudanteId === this.estudanteSelecionadoId()
      );
    }

    switch (this.filtroSelecionado()) {
      case 'pendente':
        return lista.filter((tarefa) => tarefa.status === 'PENDENTE');

      case 'concluida':
        return lista.filter((tarefa) => tarefa.status === 'CONCLUIDA');

      case 'alta':
        return lista.filter((tarefa) => tarefa.prioridade === 'ALTA');

      default:
        return lista;
    }
  });

  totalTarefasPagina = computed(() =>
    this.tarefasFiltradas().length
  );

  totalPendentes = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === 'PENDENTE'
    ).length
  );

  totalConcluidas = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === 'CONCLUIDA'
    ).length
  );

  totalAlta = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.prioridade === 'ALTA'
    ).length
  );

  ngOnInit(): void {
    this.estudanteService.carregar();
    this.carregarTarefas();
  }

  ehAdmin(): boolean {
        return this.authService.ehAdmin();
  }

  carregarTarefas(): void {
    this.tarefaService.listarPaginado({
      pagina: this.paginaAtual,
      tamanho: this.tamanhoPagina,
      ordenarPor: 'dataEntrega',
      direcao: 'asc',
      estudanteId: this.estudanteSelecionadoId(),
      status: this.filtroStatus(),
      prioridade: this.filtroPrioridade()
    });
  }

  aoMudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.tamanhoPagina = evento.pageSize;

    this.carregarTarefas();
  }

  aplicarFiltroGeral(
    filtro: 'todas' | 'pendente' | 'concluida' | 'alta'
  ): void {
    this.filtroSelecionado.set(filtro);
  }

  pesquisar(): void {
    this.termoBusca.set(this.busca.value.trim());
  }

  limparBusca(): void {
    this.busca.setValue('');
    this.termoBusca.set('');
  }

  salvarFormulario(): void {
    if (this.novoEstudanteId === null || this.novaDataEntrega === null) {
      return;
    }

    const dadosFormulario = {
      estudanteId: this.novoEstudanteId,
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade,
      dataEntrega: this.novaDataEntrega
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();

    setTimeout(() => {
      this.carregarTarefas();
    }, 300);
  }

  buscarNomeEstudante(id: number): string {
    const estudante = this.estudanteService.buscarPorId(id);
    return estudante ? estudante.nome : 'Não encontrado';
  }

  editarTarefaPorId(id: number): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
      this.novoEstudanteId = tarefa.estudanteId;
      this.novaDataEntrega = tarefa.dataEntrega
        ? new Date(tarefa.dataEntrega)
        : null;
    }
  }

  removerTarefa(id: number): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: boolean) => {
      if (confirmou) {
        this.tarefaService.remover(id);

        if (this.idEmEdicao === id) {
          this.limparFormulario();
        }

        setTimeout(() => {
          this.carregarTarefas();
        }, 300);
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

    private limparFormulario(): void {
    this.idEmEdicao = null;
    this.novoNome = '';
    this.novoStatus = 'PENDENTE';
    this.novaPrioridade = 'MEDIA';
    this.novoEstudanteId = null;
    this.novaDataEntrega = null;
  }

  aplicarFiltroEstudante(id: number | null): void {
    this.estudanteSelecionadoId.set(id);
  }

}
