export type TurnoEstudante = 'matutino' | 'vespertino' | 'noturno';

export type Estudante = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
};
