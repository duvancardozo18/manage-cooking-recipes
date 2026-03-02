import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appDebounceClick]',
    standalone: true
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input() debounceTime: number = 500;
    @Output() debounceClick = new EventEmitter();

    private clicks = new Subject();
    private subscription: Subscription | null = null;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks.pipe(
            debounceTime(this.debounceTime)
        ).subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('click', ['$event'])
    clickEvent(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
