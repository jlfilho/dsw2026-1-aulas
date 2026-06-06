import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TurnoEstudante } from '../../models/estudante.model';
import { TurnoLabelPipe } from '../../pipes/turno-label-pipe';
import { AuthService } from '../../services/auth.service';
import { EstudanteService } from '../../services/estudante.service';

@Component({
  selector: 'app-estudantes',
  imports: [
    ReactiveFormsModule,
    TurnoLabelPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css',
})
export class Estudantes implements OnInit {
  private readonly estudanteService = inject(EstudanteService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  estudantes = this.estudanteService.listar();
  totalEstudantes = this.estudanteService.totalRegistros();
  carregando = this.estudanteService.estaCarregando();
  erro = this.estudanteService.mensagemErro();

  ehAdmin = () => this.authService.ehAdmin();

  colunasExibidas = ['nome', 'email', 'curso', 'turno', 'dataIngresso', 'acoes'];

  paginaAtual = 0;
  tamanhoPagina = 5;
  termoBusca = signal('');

  ordenarPor = '';
  direcaoOrdenacao: 'asc' | 'desc' | '' = '';

  idEmEdicao: number | null = null;

  busca = new FormControl('', {
    nonNullable: true,
  });

  formEstudante = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    curso: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    turno: new FormControl<TurnoEstudante | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dataIngresso: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  estudantesFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();

    if (!termo) {
      return this.estudantes();
    }

    return this.estudantes().filter((estudante) => {
      return (
        estudante.nome.toLowerCase().includes(termo) ||
        estudante.email.toLowerCase().includes(termo) ||
        estudante.curso.toLowerCase().includes(termo) ||
        estudante.turno.toLowerCase().includes(termo) ||
        estudante.dataIngresso.toLowerCase().includes(termo)
      );
    });
  });

  ngOnInit(): void {
    this.carregarEstudantes();
  }

  carregarEstudantes(): void {
    this.estudanteService.listarPaginado({
      pagina: this.paginaAtual,
      tamanho: this.tamanhoPagina,
      ordenarPor: this.ordenarPor,
      direcao: this.direcaoOrdenacao,
    });
  }

  aoMudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.tamanhoPagina = evento.pageSize;

    this.carregarEstudantes();
  }

  aoMudarOrdenacao(evento: Sort): void {
    this.ordenarPor = evento.active;
    this.direcaoOrdenacao = evento.direction;

    this.paginaAtual = 0;
    this.paginator?.firstPage();

    this.carregarEstudantes();
  }

  pesquisar(): void {
    this.termoBusca.set(this.busca.value.trim());
  }

  limparBusca(): void {
    this.busca.setValue('');
    this.termoBusca.set('');
  }

  salvarFormulario(): void {
    if (this.formEstudante.invalid) {
      this.formEstudante.markAllAsTouched();
      return;
    }

    const dadosFormulario = this.formEstudante.getRawValue();

    const estudante = {
      nome: dadosFormulario.nome,
      email: dadosFormulario.email,
      curso: dadosFormulario.curso,
      turno: dadosFormulario.turno as TurnoEstudante,
      dataIngresso: dadosFormulario.dataIngresso,
    };

    if (this.idEmEdicao === null) {
      this.estudanteService.cadastrar(estudante);
    } else {
      this.estudanteService.editar(this.idEmEdicao, estudante);
    }

    this.limparFormulario();

    setTimeout(() => {
      this.carregarEstudantes();
    }, 300);
  }

  editarEstudante(id: number): void {
    const estudante = this.estudanteService.buscarPorId(id);

    if (estudante) {
      this.idEmEdicao = estudante.id;

      this.formEstudante.setValue({
        nome: estudante.nome,
        email: estudante.email,
        curso: estudante.curso,
        turno: estudante.turno,
        dataIngresso: estudante.dataIngresso,
      });
    }
  }

  removerEstudante(id: number): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: boolean) => {
      if (confirmou) {
        this.estudanteService.remover(id);

        if (this.idEmEdicao === id) {
          this.limparFormulario();
        }

        setTimeout(() => {
          this.carregarEstudantes();
        }, 300);
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formEstudante.get(nomeCampo);

    return !!campo && campo.invalid && campo.touched;
  }

  private limparFormulario(): void {
    this.idEmEdicao = null;

    this.formEstudante.reset({
      nome: '',
      email: '',
      curso: '',
      turno: '',
      dataIngresso: '',
    });
  }
}
