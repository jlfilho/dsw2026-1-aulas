export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export type Tarefa = {
  id: number;
  estudanteId: number;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega?: Date;
};
