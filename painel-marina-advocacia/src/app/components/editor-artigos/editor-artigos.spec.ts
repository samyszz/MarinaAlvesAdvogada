import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorArtigos } from './editor-artigos';

describe('EditorArtigos', () => {
  let component: EditorArtigos;
  let fixture: ComponentFixture<EditorArtigos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorArtigos],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorArtigos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
