import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';

@Component({
    template: `<button appTooltip="Test Tooltip" tooltipPosition="top">Hover Me</button>`,
    standalone: true,
    imports: [TooltipDirective]
})
class TestComponent { }

describe('TooltipDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let button: HTMLButtonElement;
    let buttonDebug: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        buttonDebug = fixture.debugElement.query(By.css('button'));
        button = buttonDebug.nativeElement;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(button).toBeTruthy();
    });

    it('should show tooltip on mouseenter', () => {
        buttonDebug.triggerEventHandler('mouseenter', null);
        fixture.detectChanges();

        const tooltip = document.body.querySelector('span');
        expect(tooltip).toBeTruthy();
        expect(tooltip?.textContent).toBe('Test Tooltip');
    });

    it('should hide tooltip on mouseleave', () => {
        buttonDebug.triggerEventHandler('mouseenter', null);
        fixture.detectChanges();
        buttonDebug.triggerEventHandler('mouseleave', null);
        fixture.detectChanges();

        const tooltip = document.body.querySelector('span');
        expect(tooltip).toBeFalsy();
    });
});
