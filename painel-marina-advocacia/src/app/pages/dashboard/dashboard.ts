import { Component } from '@angular/core';
import { EditorArtigos } from '../../components/editor-artigos/editor-artigos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [EditorArtigos],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // Lógica de menus ou dados do usuário logado
}