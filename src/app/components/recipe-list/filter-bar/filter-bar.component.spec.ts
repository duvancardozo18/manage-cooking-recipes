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

    it('should emit searchQueryChange when search input changes', (done) => {
        component.searchQueryChange.subscribe((value) => {
            expect(value).toBe('test search');
            done();
        });
        const input = document.createElement('input');
        input.value = 'test search';
        const event = { target: input } as any;
        component.onSearchChange(event);
    });

    it('should emit categoryChange when category select changes', (done) => {
        component.categoryChange.subscribe((value) => {
            expect(value).toBe('Beef');
            done();
        });
        const select = document.createElement('select');
        select.value = 'Beef';
        const event = { target: select } as any;
        component.onCategoryChange(event);
    });

    it('should emit difficultyChange when difficulty select changes', (done) => {
        component.difficultyChange.subscribe((value) => {
            expect(value).toBe('easy');
            done();
        });
        const select = document.createElement('select');
        select.value = 'easy';
        const event = { target: select } as any;
        component.onDifficultyChange(event);
    });

    it('should emit clearFilters when clear button is clicked', (done) => {
        component.clearFilters.subscribe(() => {
            expect(true).toBe(true);
            done();
        });
        component.onClearFilters();
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
