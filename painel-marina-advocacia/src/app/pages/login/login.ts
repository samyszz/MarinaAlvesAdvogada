import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const FIXED_ADMIN_EMAIL = 'admin@marinaalves.adv.br';
const FIXED_ADMIN_PASSWORD = 'Marina@2026';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  formLogin: FormGroup;
  erroLogin = false;
  carregando = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.formLogin.valid) {
      this.carregando = true;
      this.erroLogin = false;
      const email = String(this.formLogin.value.email ?? '').trim().toLowerCase();
      const senha = String(this.formLogin.value.senha ?? '');

      try {
        if (email === FIXED_ADMIN_EMAIL && senha === FIXED_ADMIN_PASSWORD) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.erroLogin = true;
      } catch (error) {
        console.error('Erro ao autenticar:', error);
        this.erroLogin = true; // Mostra o alerta vermelho na tela
      } finally {
        this.carregando = false;
      }
    } else {
      this.formLogin.markAllAsTouched();
    }
  }
}