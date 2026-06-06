import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prioridadeLabel',
})
export class PrioridadeLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'BAIXA':
        return 'Baixa';
      case 'MEDIA':
        return 'Média';
      case 'ALTA':
        return 'Alta';
      default:
        return valor;
    }
  }
}
