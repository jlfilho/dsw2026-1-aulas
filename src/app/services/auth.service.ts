import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { API_URL } from '../config/api.config';
import { LoginRequest, LoginResponse, RoleUsuario, UsuarioAutenticado } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly chaveToken = 'access_token';
  private readonly chaveUsuario = 'usuario_logado';

  private readonly token = signal<string | null>(localStorage.getItem(this.chaveToken));

  private readonly usuario = signal<UsuarioAutenticado | null>(this.carregarUsuarioDoStorage());

  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  usuarioLogado = this.usuario.asReadonly();
  carregandoLogin = this.carregando.asReadonly();
  erroLogin = this.erro.asReadonly();

  estaAutenticado = computed(() => {
    return !!this.token();
  });

  login(dados: LoginRequest): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.post<LoginResponse>(`${API_URL}/auth/login`, dados).subscribe({
      next: (resposta) => {
        this.salvarSessao(resposta);
        this.carregando.set(false);
        this.router.navigate(['/estudantes']);
      },
      error: () => {
        this.erro.set('E-mail ou senha inválidos.');
        this.carregando.set(false);
      },
    });
  }

  logout(): void {
    localStorage.removeItem(this.chaveToken);
    localStorage.removeItem(this.chaveUsuario);

    this.token.set(null);
    this.usuario.set(null);

    this.router.navigate(['/login']);
  }

  obterToken(): string | null {
    return this.token();
  }

  temPerfil(role: RoleUsuario): boolean {
    return this.usuario()?.role === role;
  }

  ehAdmin(): boolean {
    return this.usuario()?.role === 'ADMIN';
  }

  private salvarSessao(resposta: LoginResponse): void {
    localStorage.setItem(this.chaveToken, resposta.accessToken);
    localStorage.setItem(this.chaveUsuario, JSON.stringify(resposta.usuario));

    this.token.set(resposta.accessToken);
    this.usuario.set(resposta.usuario);
  }

  private carregarUsuarioDoStorage(): UsuarioAutenticado | null {
    const usuarioSalvo = localStorage.getItem(this.chaveUsuario);

    if (!usuarioSalvo) {
      return null;
    }

    try {
      return JSON.parse(usuarioSalvo) as UsuarioAutenticado;
    } catch {
      localStorage.removeItem(this.chaveUsuario);
      return null;
    }
  }
}
