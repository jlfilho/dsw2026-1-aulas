import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTarefaLabel',
})
export class StatusTarefaLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'pendente':
        return 'Pendente';
      case 'em andamento':
        return 'Em andamento';
      case 'concluida':
        return 'Concluída';
      default:
        return valor;
    }
  }
}
