import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective implements OnDestroy {
    @Input() appTooltip: string = '';
    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

    private tooltipElement: HTMLElement | null = null;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.appTooltip) return;
        this.showTooltip();
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.hideTooltip();
    }

    private showTooltip() {
        this.tooltipElement = this.renderer.createElement('span');
        const text = this.renderer.createText(this.appTooltip);
        this.renderer.appendChild(this.tooltipElement, text);

        // Estilos del tooltip
        this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipElement, 'background-color', '#333');
        this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
        this.renderer.setStyle(this.tooltipElement, 'padding', '6px 12px');
        this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
        this.renderer.setStyle(this.tooltipElement, 'font-size', '14px');
        this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
        this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
        this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 8px rgba(0,0,0,0.15)');

        this.renderer.appendChild(document.body, this.tooltipElement);
        this.positionTooltip();
    }

    private positionTooltip() {
        if (!this.tooltipElement) return;

        const hostRect = this.el.nativeElement.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const offset = 8;

        let top = 0;
        let left = 0;

        switch (this.tooltipPosition) {
            case 'top':
                top = hostRect.top - tooltipRect.height - offset;
                left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = hostRect.bottom + offset;
                left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
                left = hostRect.left - tooltipRect.width - offset;
                break;
            case 'right':
                top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
                left = hostRect.right + offset;
                break;
        }

        this.renderer.setStyle(this.tooltipElement, 'top', `${top + window.scrollY}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left + window.scrollX}px`);
    }

    private hideTooltip() {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }

    ngOnDestroy() {
        this.hideTooltip();
    }
}
