import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Estudante, TurnoEstudante } from '../../models/estudante.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EstudanteService } from '../../services/estudante.service';
import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TurnoLabelPipe } from '../../pipes/turno-label-pipe';

@Component({
  selector: 'app-estudantes',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    TurnoLabelPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css',
})
export class Estudantes {
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  estudantes = this.estudanteService.listar();

  idEmEdicao: number | null = null;

  formEstudante = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    curso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    turno: new FormControl<TurnoEstudante | ''>('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    dataIngresso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  });

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
      dataIngresso: dadosFormulario.dataIngresso
    };

    if (this.idEmEdicao === null) {
      this.estudanteService.cadastrar(estudante);
    } else {
      this.estudanteService.editar(this.idEmEdicao, estudante);
    }

    this.limparFormulario();
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
        dataIngresso: estudante.dataIngresso
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
      dataIngresso: ''
    });
  }
}
