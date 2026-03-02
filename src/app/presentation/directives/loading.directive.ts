import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appLoading]',
    standalone: true
})
export class LoadingDirective implements OnChanges {
    @Input() appLoading: boolean = false;
    @Input() loadingText: string = 'Cargando...';

    private overlay: HTMLElement | null = null;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appLoading']) {
            if (this.appLoading) {
                this.showLoading();
            } else {
                this.hideLoading();
            }
        }
    }

    private showLoading() {
        this.overlay = this.renderer.createElement('div');

        this.renderer.setStyle(this.overlay, 'position', 'absolute');
        this.renderer.setStyle(this.overlay, 'top', '0');
        this.renderer.setStyle(this.overlay, 'left', '0');
        this.renderer.setStyle(this.overlay, 'width', '100%');
        this.renderer.setStyle(this.overlay, 'height', '100%');
        this.renderer.setStyle(this.overlay, 'background', 'rgba(255, 255, 255, 0.8)');
        this.renderer.setStyle(this.overlay, 'display', 'flex');
        this.renderer.setStyle(this.overlay, 'align-items', 'center');
        this.renderer.setStyle(this.overlay, 'justify-content', 'center');
        this.renderer.setStyle(this.overlay, 'z-index', '999');

        const spinner = this.renderer.createElement('div');
        this.renderer.setStyle(spinner, 'border', '4px solid #f3f3f3');
        this.renderer.setStyle(spinner, 'border-top', '4px solid #3498db');
        this.renderer.setStyle(spinner, 'border-radius', '50%');
        this.renderer.setStyle(spinner, 'width', '40px');
        this.renderer.setStyle(spinner, 'height', '40px');
        this.renderer.setStyle(spinner, 'animation', 'spin 2s linear infinite');

        const text = this.renderer.createElement('span');
        const textContent = this.renderer.createText(this.loadingText);
        this.renderer.appendChild(text, textContent);
        this.renderer.setStyle(text, 'margin-left', '12px');
        this.renderer.setStyle(text, 'font-weight', '500');
        this.renderer.setStyle(text, 'color', '#333');


        const container = this.renderer.createElement('div');
        this.renderer.setStyle(container, 'display', 'flex');
        this.renderer.setStyle(container, 'align-items', 'center');

        this.renderer.appendChild(container, spinner);
        this.renderer.appendChild(container, text);
        this.renderer.appendChild(this.overlay, container);

        const position = window.getComputedStyle(this.el.nativeElement).position;
        if (position === 'static') {
            this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
        }

        this.addSpinnerAnimation();

        this.renderer.appendChild(this.el.nativeElement, this.overlay);
    }

    private hideLoading() {
        if (this.overlay) {
            this.renderer.removeChild(this.el.nativeElement, this.overlay);
            this.overlay = null;
        }
    }

    private addSpinnerAnimation() {
        const styleId = 'spinner-animation-style';
        if (!document.getElementById(styleId)) {
            const style = this.renderer.createElement('style');
            this.renderer.setAttribute(style, 'id', styleId);
            const css = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
            this.renderer.appendChild(style, this.renderer.createText(css));
            this.renderer.appendChild(document.head, style);
        }
    }
}
