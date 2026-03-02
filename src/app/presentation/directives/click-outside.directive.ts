import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() appClickOutside = new EventEmitter<void>();

    constructor(private el: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    public onClick(target: EventTarget | null) {
        if (!target) return;
        const clickedInside = this.el.nativeElement.contains(target);
        if (!clickedInside) {
            this.appClickOutside.emit();
        }
    }
}
