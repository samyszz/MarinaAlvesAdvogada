import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { EditorArtigos } from '../../components/editor-artigos/editor-artigos';
import { Observable, of } from 'rxjs';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '../../firebase';

interface Lead {
  id?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  interesse?: string;
  mensagem?: string;
  origem?: string;
  criadoEm?: unknown;
}

interface Article {
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EditorArtigos],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  secaoAtiva: 'artigos' | 'leads' = 'artigos';
  leads$: Observable<Lead[]>;
  artigos$: Observable<Article[]>;

  artigoEditando: Article | null = null;
  artigoParaExcluir: Article | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    if (isPlatformBrowser(platformId)) {
      const leadsQuery = query(collection(firestore, 'leads'), orderBy('criadoEm', 'desc'));
      const artigosQuery = query(collection(firestore, 'articles'), orderBy('criadoEm', 'desc'));
      this.leads$ = streamCollection<Lead>(leadsQuery);
      this.artigos$ = streamCollection<Article>(artigosQuery);
    } else {
      this.leads$ = of([]);
      this.artigos$ = of([]);
    }
  }

  capaArtigo(artigo: Article): string | null {
    return artigo.capaUrl || null;
  }

  abrirSecao(secao: 'artigos' | 'leads') {
    this.secaoAtiva = secao;
    this.artigoEditando = null;
    this.artigoParaExcluir = null;
  }

  editarArtigo(artigo: Article) {
    this.artigoEditando = artigo;
  }

  onEditCancelado() {
    this.artigoEditando = null;
  }

  onArtigoSalvo() {
    this.artigoEditando = null;
  }

  confirmarExcluir(artigo: Article) {
    this.artigoParaExcluir = artigo;
  }

  cancelarExcluir() {
    this.artigoParaExcluir = null;
  }

  async excluirArtigo() {
    if (!this.artigoParaExcluir?.id) return;

    try {
      await deleteDoc(doc(firestore, 'articles', this.artigoParaExcluir.id));
      this.artigoParaExcluir = null;
    } catch (error) {
      console.error('Erro ao excluir artigo:', error);
    }
  }

  logout() {
    console.log('Encerrando sessão...');
    this.router.navigate(['/login']);
  }
}

function streamCollection<T extends object>(firebaseQuery: ReturnType<typeof query>): Observable<T[]> {
  return new Observable<T[]>((subscriber) => {
    const unsubscribe = onSnapshot(
      firebaseQuery,
      (snapshot) => {
        subscriber.next(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as object) } as unknown as T)));
      },
      (error) => subscriber.error(error),
    );

    return unsubscribe;
  });
}