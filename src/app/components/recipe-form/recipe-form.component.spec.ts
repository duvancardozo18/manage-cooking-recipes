import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RecipeFormComponent } from './recipe-form.component';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../domain/entities/recipe.entity';
import { of } from 'rxjs';

describe('RecipeFormComponent', () => {
    let component: RecipeFormComponent;
    let mockApplicationService: any;
    let mockRouter: any;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        mockApplicationService = {
            getRecipeById: vi.fn().mockReturnValue(null),
            createRecipe: vi.fn(),
            updateRecipe: vi.fn()
        };

        mockRouter = {
            navigate: vi.fn()
        };

        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: vi.fn().mockReturnValue(null)
                }
            },
            paramMap: of({
                get: vi.fn().mockReturnValue(null)
            })
        };

        await TestBed.configureTestingModule({
            imports: [RecipeFormComponent],
            providers: [
                { provide: RecipeApplicationService, useValue: mockApplicationService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(RecipeFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Component initialization', () => {
        it('should create', () => {
            expect(component).toBeDefined();
        });

        it('should initialize form with empty values for new recipe', () => {
            expect(component.recipeForm.value.name).toBe('');
            expect(component.recipeForm.value.description).toBe('');
            expect(component.recipeForm.value.prepTime).toBe(0);
            expect(component.recipeForm.value.cookTime).toBe(0);
            expect(component.recipeForm.value.servings).toBe(1);
            expect(component.recipeForm.value.difficulty).toBe('medium');
        });

        it('should have valid form controls', () => {
            const form = component.recipeForm;

            expect(form.get('name')).toBeDefined();
            expect(form.get('description')).toBeDefined();
            expect(form.get('ingredients')).toBeDefined();
            expect(form.get('instructions')).toBeDefined();
            expect(form.get('prepTime')).toBeDefined();
            expect(form.get('cookTime')).toBeDefined();
            expect(form.get('servings')).toBeDefined();
            expect(form.get('difficulty')).toBeDefined();
            expect(form.get('category')).toBeDefined();
            expect(form.get('imageUrl')).toBeDefined();
        });
    });

    describe('Form validation', () => {
        it('should require name', () => {
            const nameControl = component.recipeForm.get('name');

            nameControl?.setValue('');
            expect(nameControl?.hasError('required')).toBe(true);

            nameControl?.setValue('Pizza');
            expect(nameControl?.hasError('required')).toBe(false);
        });

        it('should require minimum name length', () => {
            const nameControl = component.recipeForm.get('name');

            nameControl?.setValue('Ab');
            expect(nameControl?.hasError('minlength')).toBe(true);

            nameControl?.setValue('Abc');
            expect(nameControl?.hasError('minlength')).toBe(false);
        });

        it('should require description', () => {
            const descControl = component.recipeForm.get('description');

            descControl?.setValue('');
            expect(descControl?.hasError('required')).toBe(true);

            descControl?.setValue('A description');
            expect(descControl?.hasError('required')).toBe(false);
        });

        it('should require minimum description length', () => {
            const descControl = component.recipeForm.get('description');

            descControl?.setValue('Short');
            expect(descControl?.hasError('minlength')).toBe(true);

            descControl?.setValue('A long enough description');
            expect(descControl?.hasError('minlength')).toBe(false);
        });

        it('should require positive prep time', () => {
            const prepTimeControl = component.recipeForm.get('prepTime');

            prepTimeControl?.setValue(0);
            expect(prepTimeControl?.hasError('min')).toBe(true);

            prepTimeControl?.setValue(1);
            expect(prepTimeControl?.hasError('min')).toBe(false);
        });

        it('should require positive cook time', () => {
            const cookTimeControl = component.recipeForm.get('cookTime');

            cookTimeControl?.setValue(0);
            expect(cookTimeControl?.hasError('min')).toBe(true);

            cookTimeControl?.setValue(1);
            expect(cookTimeControl?.hasError('min')).toBe(false);
        });

        it('should require positive servings', () => {
            const servingsControl = component.recipeForm.get('servings');

            servingsControl?.setValue(0);
            expect(servingsControl?.hasError('min')).toBe(true);

            servingsControl?.setValue(1);
            expect(servingsControl?.hasError('min')).toBe(false);
        });
    });

    describe('Ingredient management', () => {
        it('should initialize with one empty ingredient', () => {
            expect(component.ingredients.length).toBe(1);
        });

        it('should add ingredient', () => {
            const initialLength = component.ingredients.length;

            component.addIngredient();

            expect(component.ingredients.length).toBe(initialLength + 1);
        });

        it('should remove ingredient', () => {
            component.addIngredient();
            component.addIngredient();
            const length = component.ingredients.length;

            component.removeIngredient(1);

            expect(component.ingredients.length).toBe(length - 1);
        });

        it('should not remove last ingredient', () => {
            while (component.ingredients.length > 1) {
                component.removeIngredient(component.ingredients.length - 1);
            }

            component.removeIngredient(0);

            expect(component.ingredients.length).toBe(1);
        });
    });

    describe('Instruction management', () => {
        it('should initialize with one empty instruction', () => {
            expect(component.instructions.length).toBe(1);
        });

        it('should add instruction', () => {
            const initialLength = component.instructions.length;

            component.addInstruction();

            expect(component.instructions.length).toBe(initialLength + 1);
        });

        it('should remove instruction', () => {
            component.addInstruction();
            component.addInstruction();
            const length = component.instructions.length;

            component.removeInstruction(1);

            expect(component.instructions.length).toBe(length - 1);
        });

        it('should not remove last instruction', () => {
            while (component.instructions.length > 1) {
                component.removeInstruction(component.instructions.length - 1);
            }

            component.removeInstruction(0);

            expect(component.instructions.length).toBe(1);
        });
    });

    describe('Form submission', () => {
        it('should not submit invalid form', () => {
            component.recipeForm.patchValue({ name: '' });

            component.onSubmit();

            expect(mockApplicationService.createRecipe).not.toHaveBeenCalled();
            expect(mockApplicationService.updateRecipe).not.toHaveBeenCalled();
        });

        it('should create recipe when form is valid and no recipeId', () => {
            component.recipeForm.patchValue({
                name: 'New Recipe',
                description: 'A new recipe description',
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'medium',
                category: 'Italian',
                imageUrl: 'image.jpg'
            });

            component.ingredients.at(0).setValue('Ingredient 1');
            component.instructions.at(0).setValue('Step 1');

            const mockRecipe = new Recipe('1', 'New Recipe', 'Desc', ['Ing'], ['Step'], 10, 20, 4, 'medium', 'Cat', null, new Date(), new Date());
            mockApplicationService.createRecipe.mockReturnValue(mockRecipe);

            component.onSubmit();

            expect(mockApplicationService.createRecipe).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes', '1']);
        });

        it('should handle create recipe error', () => {
            component.recipeForm.patchValue({
                name: 'New Recipe',
                description: 'A new recipe description',
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'medium',
                category: 'Italian'
            });

            component.ingredients.at(0).setValue('Ingredient 1');
            component.instructions.at(0).setValue('Step 1');

            mockApplicationService.createRecipe.mockImplementation(() => {
                throw new Error('Creation failed');
            });

            component.onSubmit();

            expect(component.errorMessage()).toBeTruthy();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
    });

    describe('Edit mode', () => {
        it('should load recipe in edit mode', () => {
            const existingRecipe = new Recipe(
                '123',
                'Existing Recipe',
                'Existing Description',
                ['Ingredient 1', 'Ingredient 2'],
                ['Step 1', 'Step 2'],
                15,
                25,
                4,
                'hard',
                'Dessert',
                'image.jpg',
                new Date(),
                new Date()
            );

            mockApplicationService.getRecipeById.mockReturnValue(existingRecipe);
            mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('123');

            const newFixture = TestBed.createComponent(RecipeFormComponent);
            const newComponent = newFixture.componentInstance;
            newFixture.detectChanges();

            expect(mockApplicationService.getRecipeById).toHaveBeenCalledWith('123');
            expect(newComponent.recipeForm.value.name).toBe('Existing Recipe');
        });
    });
});
