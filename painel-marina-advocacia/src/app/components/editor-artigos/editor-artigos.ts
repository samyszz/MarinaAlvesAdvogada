import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editor-artigos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor-artigos.html',
  styleUrls: ['./editor-artigos.css']
})
export class EditorArtigos {
  formArtigo: FormGroup;
  imagemSelecionada: File | null = null;
  salvando = false;
  salvoSucesso = false;

  constructor(private fb: FormBuilder) {
    this.formArtigo = this.fb.group({
      titulo: ['', Validators.required],
      categoria: ['Direito Civil', Validators.required],
      resumo: ['', [Validators.required, Validators.maxLength(200)]],
      conteudoHtml: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
    }
  }

  async onPublicar() {
    if (this.formArtigo.valid) {
      this.salvando = true;
      const dados = this.formArtigo.value;

      try {
        console.log('Enviando para Firebase/Cloudinary:', dados);
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.salvoSucesso = true;
        this.formArtigo.reset({ categoria: 'Direito Civil' });
        this.imagemSelecionada = null;
        
        setTimeout(() => this.salvoSucesso = false, 4000);
      } catch (error) {
        console.error(error);
      } finally {
        this.salvando = false;
      }
    } else {
      this.formArtigo.markAllAsTouched();
    }
  }
}