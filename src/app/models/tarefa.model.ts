export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export type Tarefa = {
  id: number;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
};
