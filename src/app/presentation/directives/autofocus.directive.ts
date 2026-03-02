import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[appAutofocus]',
    standalone: true
})
export class AutofocusDirective implements OnInit {
    @Input() appAutofocus: boolean = true;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        if (this.appAutofocus) {
            setTimeout(() => {
                this.el.nativeElement.focus();
            }, 100);
        }
    }
}
