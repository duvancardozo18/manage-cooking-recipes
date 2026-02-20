import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
    let component: FilterBarComponent;
    let fixture: ComponentFixture<FilterBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterBarComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FilterBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit searchQueryChange when search input changes', () => {
        const emitSpy = jest.spyOn(component.searchQueryChange, 'emit');
        const input = document.createElement('input');
        input.value = 'test search';
        const event = { target: input } as any;
        component.onSearchChange(event);
        expect(emitSpy).toHaveBeenCalledWith('test search');
    });

    it('should emit categoryChange when category select changes', () => {
        const emitSpy = jest.spyOn(component.categoryChange, 'emit');
        const event = { target: { value: 'Beef' } } as any;
        component.onCategoryChange(event);
        expect(emitSpy).toHaveBeenCalledWith('Beef');
    });

    it('should emit difficultyChange when difficulty select changes', () => {
        const emitSpy = jest.spyOn(component.difficultyChange, 'emit');
        const event = { target: { value: 'easy' } } as any;
        component.onDifficultyChange(event);
        expect(emitSpy).toHaveBeenCalledWith('easy');
    });

    it('should emit clearFilters when clear button is clicked', () => {
        const emitSpy = jest.spyOn(component.clearFilters, 'emit');
        component.onClearFilters();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should return true when filters are active', () => {
        component.searchQuery = 'test';
        expect(component.hasActiveFilters()).toBe(true);

        component.searchQuery = '';
        component.selectedCategory = 'Beef';
        expect(component.hasActiveFilters()).toBe(true);

        component.selectedCategory = '';
        component.selectedDifficulty = 'easy';
        expect(component.hasActiveFilters()).toBe(true);
    });

    it('should return false when no filters are active', () => {
        component.searchQuery = '';
        component.selectedCategory = '';
        component.selectedDifficulty = '';
        expect(component.hasActiveFilters()).toBe(false);
    });
});
