import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../domain/entities/recipe.entity';
import { of, Subject } from 'rxjs';

describe('RecipeDetailComponent', () => {
    let component: RecipeDetailComponent;
    let mockApplicationService: any;
    let mockRouter: any;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        const mockRecipe = new Recipe(
            '123',
            'Test Recipe',
            'Test Description',
            ['Ingredient 1', 'Ingredient 2'],
            ['Step 1', 'Step 2'],
            10,
            20,
            4,
            'medium',
            'Italian',
            'test-image.jpg',
            new Date(),
            new Date()
        );

        mockApplicationService = {
            getRecipeById: vi.fn().mockReturnValue(mockRecipe),
            deleteRecipe: vi.fn().mockReturnValue(true),
            recipeAdded$: new Subject<Recipe>().asObservable(),
            recipeUpdated$: new Subject<Recipe>().asObservable(),
            recipeDeleted$: new Subject<string>().asObservable()
        };

        mockRouter = {
            navigate: vi.fn()
        };

        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: vi.fn().mockReturnValue('123')
                }
            },
            paramMap: of({
                get: vi.fn().mockReturnValue('123')
            })
        };

        await TestBed.configureTestingModule({
            imports: [RecipeDetailComponent],
            providers: [
                { provide: RecipeApplicationService, useValue: mockApplicationService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(RecipeDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should load recipe on init', () => {
        expect(mockApplicationService.getRecipeById).toHaveBeenCalledWith('123');
    });

    it('should convert recipe to view model', () => {
        const viewModel = component.recipe();

        expect(viewModel).toBeDefined();
        expect(viewModel?.name).toBe('Test Recipe');
        expect(viewModel).toHaveProperty('totalTime');
        expect(viewModel).toHaveProperty('difficultyColor');
    });

    it('should delete recipe and navigate to list', () => {
        // Mock window.confirm to return true
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        component.deleteRecipe();

        expect(mockApplicationService.deleteRecipe).toHaveBeenCalledWith('123');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
    });

    it('should handle recipe not found', async () => {
        mockApplicationService.getRecipeById.mockReturnValue(null);
        mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('999');

        const fixture = TestBed.createComponent(RecipeDetailComponent);
        const newComponent = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
    });
});
