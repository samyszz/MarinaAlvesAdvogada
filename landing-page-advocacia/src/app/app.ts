import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { ServicesComponent } from './components/services/services';
import { ArticlesComponent } from './components/articles/articles';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ArticlesComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    // Garante que o código do IntersectionObserver rode apenas no navegador e não quebre o SSR
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Adiciona a classe que dispara a animação CSS
            entry.target.classList.add('is-visible');
            
            // Remove o observador para a animação acontecer apenas uma vez
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.15, // Dispara quando 15% do elemento estiver visível
        rootMargin: '0px 0px -20px 0px' // Margem de segurança
      });

      // Busca todos os elementos do site que possuem a classe .reveal
      document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
      });
    }
  }
}