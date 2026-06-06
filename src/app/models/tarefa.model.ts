export type StatusTarefa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export type PrioridadeTarefa = 'BAIXA' | 'MEDIA' | 'ALTA';

export type Tarefa = {
  id: number;
  estudanteId: number;
  estudanteNome: string;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega?: Date;
};
