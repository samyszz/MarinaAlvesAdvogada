import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  formLogin: FormGroup;
  erroLogin = false;
  carregando = false;

  constructor(private fb: FormBuilder) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.formLogin.valid) {
      this.carregando = true;
      const { email, senha } = this.formLogin.value;
      
      console.log('Autenticando no Firebase...', email);
      
      // Simula o tempo de resposta do banco
      setTimeout(() => {
        this.carregando = false;
        // Lógica de redirecionamento para o Dashboard entrará aqui
      }, 1500);
    } else {
      this.formLogin.markAllAsTouched();
    }
  }
}