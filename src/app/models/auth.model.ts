export type RoleUsuario = 'ADMIN' | 'PROFESSOR';

export type LoginRequest = {
  email: string;
  password: string;
};

export type UsuarioAutenticado = {
  id: number;
  nome: string;
  email: string;
  role: RoleUsuario;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  usuario: UsuarioAutenticado;
};
