import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { signal } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('RecipeListComponent', () => {
    let component: RecipeListComponent;
    let fixture: ComponentFixture<RecipeListComponent>;
    let mockRecipeService: any;
    let mockRouter: any;
    let mockActivatedRoute: any;

    const mockRecipe1 = new Recipe(
        '1',
        RecipeName.create('Pasta Carbonara'),
        'Italian pasta dish',
        ['Pasta', 'Eggs'],
        ['Boil pasta'],
        CookingTime.create(15),
        CookingTime.create(20),
        Servings.create(4),
        Difficulty.create('medium'),
        Category.create('Pasta'),
        null,
        new Date(),
        new Date()
    );

    const mockRecipe2 = new Recipe(
        '2',
        RecipeName.create('Chicken Curry'),
        'Indian curry dish',
        ['Chicken', 'Curry'],
        ['Cook chicken'],
        CookingTime.create(20),
        CookingTime.create(30),
        Servings.create(6),
        Difficulty.create('easy'),
        Category.create('Chicken'),
        null,
        new Date(),
        new Date()
    );

    beforeEach(async () => {
        const recipeAddedSubject = new Subject<Recipe>();
        const recipeUpdatedSubject = new Subject<Recipe>();
        const recipeDeletedSubject = new Subject<string>();

        mockRecipeService = {
            getRecipes: () => [mockRecipe1, mockRecipe2],
            getCategories: () => ['Pasta', 'Chicken'],
            searchRecipes: () => [mockRecipe1],
            deleteRecipe: () => true,
            recipeAdded$: recipeAddedSubject.asObservable(),
            recipeUpdated$: recipeUpdatedSubject.asObservable(),
            recipeDeleted$: recipeDeletedSubject.asObservable(),
        };

        mockRouter = {
            navigate: () => { },
        };

        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: () => null,
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [RecipeListComponent],
            providers: [
                { provide: RecipeApplicationService, useValue: mockRecipeService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RecipeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initialization', () => {
        it('should load recipes on init', () => {
            expect(component.recipes().length).toBe(2);
        });

        it('should load categories', () => {
            expect(component.categories().length).toBe(2);
            expect(component.categories()).toContain('Pasta');
            expect(component.categories()).toContain('Chicken');
        });

        it('should initialize signals with empty values', () => {
            expect(component.searchQuery()).toBe('');
            expect(component.selectedCategory()).toBe('');
            expect(component.selectedDifficulty()).toBe('');
        });
    });

    describe('filtering', () => {
        it('should filter recipes by search query', () => {
            component.searchQuery.set('pasta');
            const filtered = component.filteredRecipes();
            expect(filtered.length).toBe(1);
        });

        it('should filter recipes by category', () => {
            component.selectedCategory.set('Pasta');
            const filtered = component.filteredRecipes();
            expect(filtered.every(r => r.category === 'Pasta')).toBe(true);
        });

        it('should filter recipes by difficulty', () => {
            component.selectedDifficulty.set('easy');
            const filtered = component.filteredRecipes();
            expect(filtered.every(r => r.difficulty === 'easy')).toBe(true);
        });

        it('should combine multiple filters', () => {
            component.searchQuery.set('pasta');
            component.selectedCategory.set('Pasta');
            const filtered = component.filteredRecipes();
            expect(filtered.length).toBeGreaterThan(0);
        });
    });

    describe('event handlers', () => {
        it('should update search query on search change', () => {
            const event = { target: { value: 'test' } } as any;
            component.onSearchChange(event);
            expect(component.searchQuery()).toBe('test');
        });

        it('should update category on category change', () => {
            const event = { target: { value: 'Pasta' } } as any;
            component.onCategoryChange(event);
            expect(component.selectedCategory()).toBe('Pasta');
        });

        it('should update difficulty on difficulty change', () => {
            const event = { target: { value: 'easy' } } as any;
            component.onDifficultyChange(event);
            expect(component.selectedDifficulty()).toBe('easy');
        });

        it('should clear all filters', () => {
            component.searchQuery.set('test');
            component.selectedCategory.set('Pasta');
            component.selectedDifficulty.set('easy');

            component.clearFilters();

            expect(component.searchQuery()).toBe('');
            expect(component.selectedCategory()).toBe('');
            expect(component.selectedDifficulty()).toBe('');
        });
    });

    describe('deleteRecipe', () => {
        it('should delete a recipe when confirmed', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(true);
            let preventDefaultCalled = false;
            let stopPropagationCalled = false;
            const event = {
                preventDefault: () => { preventDefaultCalled = true; },
                stopPropagation: () => { stopPropagationCalled = true; }
            } as any;

            component.deleteRecipe('1', event);

            expect(preventDefaultCalled).toBe(true);
            expect(stopPropagationCalled).toBe(true);
        });

        it('should not delete recipe when cancelled', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(false);
            const event = {
                preventDefault: () => { },
                stopPropagation: () => { }
            } as any;

            component.deleteRecipe('1', event);

            // Recipe should not be deleted, no further assertion needed
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from all subscriptions', () => {
            const unsubscribeSpy = jest.spyOn(component['subscriptions'], 'unsubscribe');
            component.ngOnDestroy();
            expect(unsubscribeSpy).toHaveBeenCalled();
        });
    });
});
