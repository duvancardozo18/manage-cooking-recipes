import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DebounceClickDirective } from './debounce-click.directive';

@Component({
    template: `<button appDebounceClick [debounceTime]="300" (debounceClick)="onClick()">Click Me</button>`,
    standalone: true,
    imports: [DebounceClickDirective]
})
class TestComponent {
    clickCount = 0;

    onClick() {
        this.clickCount++;
    }
}

describe('DebounceClickDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let button: HTMLButtonElement;

    beforeEach(() => {
        jest.useFakeTimers();

        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        button = fixture.nativeElement.querySelector('button');
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should debounce multiple clicks', () => {
        button.click();
        button.click();
        button.click();

        jest.advanceTimersByTime(300);

        expect(component.clickCount).toBe(1);
    });

    it('should not trigger click before debounce time', () => {
        button.click();

        jest.advanceTimersByTime(200);

        expect(component.clickCount).toBe(0);
    });
});
