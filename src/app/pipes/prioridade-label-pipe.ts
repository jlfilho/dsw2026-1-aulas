import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prioridadeLabel',
})
export class PrioridadeLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'baixa':
        return 'Baixa';
      case 'media':
        return 'Média';
      case 'alta':
        return 'Alta';
      default:
        return valor;
    }
  }
}
