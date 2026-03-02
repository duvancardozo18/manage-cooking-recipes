import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective {
    @Input() appHighlight: string = '#ffeaa7';
    @Input() defaultColor: string = 'transparent';

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.appHighlight);
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(this.defaultColor);
    }

    private highlight(color: string) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease');
    }
}
