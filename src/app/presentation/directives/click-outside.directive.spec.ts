import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
    template: `
    <div appClickOutside (appClickOutside)="onClickOutside()" class="inside">
      Inside Element
    </div>
    <div class="outside">Outside Element</div>
  `,
    standalone: true,
    imports: [ClickOutsideDirective]
})
class TestComponent {
    clickedOutside = false;

    onClickOutside() {
        this.clickedOutside = true;
    }
}

describe('ClickOutsideDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should emit event when clicking outside', () => {
        const outsideElement = fixture.nativeElement.querySelector('.outside');
        outsideElement.click();

        expect(component.clickedOutside).toBe(true);
    });

    it('should not emit event when clicking inside', () => {
        const insideElement = fixture.nativeElement.querySelector('.inside');
        insideElement.click();

        expect(component.clickedOutside).toBe(false);
    });
});
