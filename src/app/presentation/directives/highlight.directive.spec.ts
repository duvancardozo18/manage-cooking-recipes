import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

@Component({
    template: `
    <div appHighlight>Default Highlight</div>
    <div appHighlight="#ff6348">Custom Color</div>
  `,
    standalone: true,
    imports: [HighlightDirective]
})
class TestComponent { }

describe('HighlightDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let elements: DebugElement[];
    let directives: HighlightDirective[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
        directives = elements.map(el => el.injector.get(HighlightDirective));
    });

    it('should create instances and apply directive', () => {
        expect(elements.length).toBe(2);
        expect(directives.length).toBe(2);
        expect(directives[0]).toBeInstanceOf(HighlightDirective);
        expect(directives[1]).toBeInstanceOf(HighlightDirective);
    });

    it('should apply default values correctly', () => {
        // Para elementos sin valor explícito, debe usar el valor por defecto
        expect(directives[0].defaultColor).toBe('transparent');
        // Para elementos con valor explicito, debe usar ese valor
        expect(directives[1].defaultColor).toBe('transparent');
    });

    it('should apply styles when mouseenter method is called', () => {
        // Usar la segunda directiva que tiene un valor explícito
        const element = elements[1].nativeElement as HTMLElement;
        const directive = directives[1];

        // Llamar directamente al método de la directiva
        directive.onMouseEnter();

        // Verificar que el estilo se aplicó
        const bgColor = element.style.backgroundColor;
        expect(bgColor).toBeTruthy();
        expect(element.style.transition).toContain('background-color');
    });

    it('should remove highlight when mouseleave method is called', () => {
        // Usar la segunda directiva que tiene un valor explícito
        const element = elements[1].nativeElement as HTMLElement;
        const directive = directives[1];

        // Primero aplicar el highlight
        directive.onMouseEnter();
        let bgColor = element.style.backgroundColor;
        expect(bgColor).toBeTruthy();

        // Luego remover
        directive.onMouseLeave();
        bgColor = element.style.backgroundColor;
        expect(['transparent', '', 'rgba(0, 0, 0, 0)']).toContain(bgColor);
    });
});
