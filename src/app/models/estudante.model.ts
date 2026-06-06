export type TurnoEstudante = 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';

export type Estudante = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
  dataIngresso: string;
};
