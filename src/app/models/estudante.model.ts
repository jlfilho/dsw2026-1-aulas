export type TurnoEstudante = 'matutino' | 'vespertino' | 'noturno';

export type Estudante = {
  id: string;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
  dataIngresso: string;
};
