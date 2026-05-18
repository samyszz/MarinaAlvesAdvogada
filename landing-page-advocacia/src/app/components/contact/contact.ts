import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  formContato: FormGroup;
  enviadoSucesso = false;
  enviando = false; // Novo estado para controlar o botão

  constructor(private fb: FormBuilder) {
    this.formContato = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mensagem: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit() {
    if (this.formContato.valid) {
      this.enviando = true; // Muda o estado para não enviar duas vezes
      const dados = this.formContato.value;

      try {
        // Dispara os dados para o FormSubmit usando Fetch API
        const response = await fetch('https://formsubmit.co/ajax/marinalves1983@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Novo Contato do Site - ${dados.nome}`, // Assunto do email
            Nome: dados.nome,
            Telefone: dados.telefone,
            Email: dados.email,
            Mensagem: dados.mensagem
          })
        });

        if (response.ok) {
          this.enviadoSucesso = true;
          this.formContato.reset();
          
          // Oculta a mensagem de sucesso após 5 segundos
          setTimeout(() => this.enviadoSucesso = false, 5000);
        }
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
        alert('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.');
      } finally {
        this.enviando = false;
      }

    } else {
      this.formContato.markAllAsTouched();
    }
  }
}