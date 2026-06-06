import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTarefaLabel',
})
export class StatusTarefaLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'PENDENTE':
        return 'Pendente';
      case 'EM_ANDAMENTO':
        return 'Em andamento';
      case 'CONCLUIDA':
        return 'Concluída';
      default:
        return valor;
    }
  }
}
