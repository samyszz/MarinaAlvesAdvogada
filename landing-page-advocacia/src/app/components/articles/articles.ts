import { Component, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '../../firebase';

interface Artigo {
  id?: string;
  titulo?: string;
  categoria?: string;
  resumo?: string;
  conteudoHtml?: string;
  publicadoEmTexto?: string;
  capaUrl?: string | null;
}

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articles.html',
  styleUrls: ['./articles.css']
})
export class ArticlesComponent implements OnDestroy {
  artigos$: Observable<Artigo[]>;
  artigoSelecionado: Artigo | null = null;

  // Carrossel
  modoCarrossel = false;
  slideAtual = 0;
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly INTERVALO_MS = 5000;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    if (isPlatformBrowser(platformId)) {
      const artigosQuery = query(collection(firestore, 'articles'), orderBy('criadoEm', 'desc'));
      this.artigos$ = streamCollection(artigosQuery).pipe(
        tap((artigos) => this.onArtigosCarregados(artigos))
      );
    } else {
      this.artigos$ = of([]);
    }
  }

  ngOnDestroy() {
    this.pararAutoPlay();
  }

  private iniciarAutoPlay() {
    this.pararAutoPlay();
    if (typeof window !== 'undefined') {
      this.autoPlayTimer = setInterval(() => this.proximo(), this.INTERVALO_MS);
    }
  }

  private pararAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  pausarAutoPlay() {
    this.pararAutoPlay();
  }

  retomarAutoPlay() {
    this.iniciarAutoPlay();
  }

  capaArtigo(artigo: { capaUrl?: string | null }): string | null {
    return artigo.capaUrl || null;
  }

  abrirArtigo(artigo: Artigo) {
    this.artigoSelecionado = artigo;
  }

  fecharArtigo() {
    this.artigoSelecionado = null;
  }

  /* Carrossel methods */
  irPara(index: number) {
    this.slideAtual = index;
  }

  proximo() {
    this.slideAtual++;
  }

  anterior() {
    this.slideAtual--;
  }

  onArtigosCarregados(artigos: unknown[]) {
    this.modoCarrossel = artigos.length >= 3;
    this.slideAtual = 0;
    this.pararAutoPlay();
    if (this.modoCarrossel) {
      this.iniciarAutoPlay();
    }
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
