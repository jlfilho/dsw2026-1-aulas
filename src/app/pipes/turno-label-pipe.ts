import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turnoLabel',
})
export class TurnoLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'matutino':
        return 'Matutino';
      case 'vespertino':
        return 'Vespertino';
      case 'noturno':
        return 'Noturno';
      default:
        return valor;
    }
  }
}
