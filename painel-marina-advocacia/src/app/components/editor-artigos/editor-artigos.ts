import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

interface Artigo {
  id?: string;
  titulo?: string;
  categoria?: string;
  resumo?: string;
  conteudoHtml?: string;
  imagemNome?: string | null;
  capaUrl?: string | null;
  status?: string;
  publicadoEmTexto?: string;
}

@Component({
  selector: 'app-editor-artigos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor-artigos.html',
  styleUrls: ['./editor-artigos.css']
})
export class EditorArtigos implements OnChanges {
  formArtigo: FormGroup;
  imagemSelecionada: File | null = null;
  salvando = false;
  salvoSucesso = false;
  editando = false;
  imagemEditandoUrl: string | null = null;

  @Input() artigoParaEditar: Artigo | null = null;
  @Output() editadoCancelado = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  // Cloudinary config
  private readonly cloudName = 'dssih4h24';
  private readonly uploadPreset = 'habitat-crm';

  constructor(
    private fb: FormBuilder,
  ) {
    this.formArtigo = this.fb.group({
      titulo: ['', Validators.required],
      categoria: ['Direito Civil', Validators.required],
      resumo: ['', [Validators.required, Validators.maxLength(200)]],
      conteudoHtml: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artigoParaEditar'] && this.artigoParaEditar) {
      this.editando = true;
      this.imagemEditandoUrl = this.artigoParaEditar.capaUrl ?? null;
      this.formArtigo.patchValue({
        titulo: this.artigoParaEditar.titulo || '',
        categoria: this.artigoParaEditar.categoria || 'Direito Civil',
        resumo: this.artigoParaEditar.resumo || '',
        conteudoHtml: this.artigoParaEditar.conteudoHtml || ''
      });
    }
  }

  cancelarEdicao() {
    this.editando = false;
    this.imagemSelecionada = null;
    this.imagemEditandoUrl = null;
    this.formArtigo.reset({ categoria: 'Direito Civil' });
    this.editadoCancelado.emit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      this.imagemEditandoUrl = null;
    }
  }

  private async uploadParaCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'articles');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error(`Upload Cloudinary falhou: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url as string;
  }

  async onPublicar() {
    if (this.formArtigo.valid) {
      this.salvando = true;
      const dados = this.formArtigo.value;

      try {
        let capaUrl: string | null = null;

        if (this.imagemSelecionada) {
          capaUrl = await this.uploadParaCloudinary(this.imagemSelecionada);
        }

        if (this.editando && this.artigoParaEditar?.id) {
          // Modo edição - atualizar documento existente
          const updateData: Record<string, unknown> = {
            titulo: dados.titulo,
            categoria: dados.categoria,
            resumo: dados.resumo,
            conteudoHtml: dados.conteudoHtml,
          };

          if (capaUrl) {
            updateData['capaUrl'] = capaUrl;
            updateData['imagemNome'] = this.imagemSelecionada?.name ?? null;
          }

          await updateDoc(doc(firestore, 'articles', this.artigoParaEditar.id), updateData);

          this.editando = false;
          this.artigoParaEditar = null;
          this.imagemEditandoUrl = null;
        } else {
          // Modo criação - novo documento
          await addDoc(collection(firestore, 'articles'), {
            titulo: dados.titulo,
            categoria: dados.categoria,
            resumo: dados.resumo,
            conteudoHtml: dados.conteudoHtml,
            imagemNome: this.imagemSelecionada?.name ?? null,
            capaUrl,
            status: 'Publicado',
            publicadoEmTexto: new Date().toLocaleDateString('pt-BR'),
            criadoEm: serverTimestamp(),
          });
        }

        this.salvoSucesso = true;
        this.formArtigo.reset({ categoria: 'Direito Civil' });
        this.imagemSelecionada = null;
        this.salvo.emit();

        setTimeout(() => this.salvoSucesso = false, 4000);
      } catch (error) {
        console.error('Erro ao publicar artigo:', error);
      } finally {
        this.salvando = false;
      }
    } else {
      this.formArtigo.markAllAsTouched();
    }
  }
}
