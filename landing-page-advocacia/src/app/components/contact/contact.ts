import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';

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

  constructor(
    private fb: FormBuilder,
  ) {
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
        await addDoc(collection(firestore, 'leads'), {
          nome: dados.nome,
          telefone: dados.telefone,
          email: dados.email,
          mensagem: dados.mensagem,
          interesse: 'Contato da landing page',
          origem: 'landing-page-advocacia',
          criadoEm: serverTimestamp(),
        });

        this.enviadoSucesso = true;
        this.formContato.reset();

        // Oculta a mensagem de sucesso após 5 segundos
        setTimeout(() => this.enviadoSucesso = false, 5000);
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