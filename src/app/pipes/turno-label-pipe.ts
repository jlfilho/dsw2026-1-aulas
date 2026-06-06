import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turnoLabel',
})
export class TurnoLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'MATUTINO':
        return 'Matutino';
      case 'VESPERTINO':
        return 'Vespertino';
      case 'NOTURNO':
        return 'Noturno';
      default:
        return valor;
    }
  }
}
