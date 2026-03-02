import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { LoadingDirective } from './loading.directive';

@Component({
    template: `<div appLoading [appLoading]="isLoading" loadingText="Procesando...">Content</div>`,
    standalone: true,
    imports: [LoadingDirective]
})
class TestComponent {
    isLoading = false;
}

describe('LoadingDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let element: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement.querySelector('div');
        // NO llamar detectChanges aquí para evitar problemas de cambio de expresión
    });

    it('should create an instance', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should show loading overlay when appLoading is true', () => {
        component.isLoading = true;
        fixture.detectChanges();

        const overlayElements = element.querySelectorAll('div');
        // Debería tener más de un div (el principal + el overlay)
        expect(overlayElements.length).toBeGreaterThan(1);
    });

    it('should not show loading overlay when appLoading is false', () => {
        component.isLoading = false;
        fixture.detectChanges();

        // No deberíamos tener overlay cuando isLoading es false
        const overlayElements = element.querySelectorAll('div');
        // Solo el div principal, sin overlay adicional
        expect(overlayElements.length).toBe(0);
    });
});
