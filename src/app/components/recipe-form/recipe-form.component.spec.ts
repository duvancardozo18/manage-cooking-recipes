import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeFormComponent } from './recipe-form.component';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('RecipeFormComponent', () => {
    let component: RecipeFormComponent;
    let fixture: ComponentFixture<RecipeFormComponent>;
    let mockRecipeService: any;
    let mockRouter: any;
    let mockActivatedRoute: any;

    const mockRecipe = new Recipe(
        '1',
        RecipeName.create('Pasta Carbonara'),
        'Italian pasta with eggs',
        ['Pasta', 'Eggs', 'Bacon'],
        ['Boil pasta', 'Fry bacon'],
        CookingTime.create(15),
        CookingTime.create(20),
        Servings.create(4),
        Difficulty.create('medium'),
        Category.create('Pasta'),
        'https://example.com/image.jpg',
        new Date(),
        new Date()
    );

    beforeEach(async () => {
        mockRecipeService = {
            getRecipeById: jest.fn().mockReturnValue(mockRecipe),
            createRecipe: jest.fn().mockReturnValue(mockRecipe),
            updateRecipe: jest.fn().mockReturnValue(mockRecipe),
        };

        mockRouter = {
            navigate: jest.fn(),
        };

        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: jest.fn().mockReturnValue(null),
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [RecipeFormComponent, ReactiveFormsModule],
            providers: [
                { provide: RecipeApplicationService, useValue: mockRecipeService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RecipeFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initialization', () => {
        it('should initialize form with empty values in create mode', () => {
            expect(component.recipeForm).toBeDefined();
            expect(component.isEditMode()).toBe(false);
            expect(component.pageTitle()).toBe('Agregar Nueva Receta');
        });

        it('should initialize form with recipe data in edit mode', () => {
            // Update the mock to return an ID
            mockActivatedRoute.snapshot.paramMap.get = jest.fn().mockReturnValue('1');

            // Create new component fixture with the updated route
            const editFixture = TestBed.createComponent(RecipeFormComponent);
            const editComponent = editFixture.componentInstance;
            editFixture.detectChanges();

            expect(editComponent.isEditMode()).toBe(true);
            expect(editComponent.pageTitle()).toBe('Editar Receta');
        });
    });

    describe('form controls', () => {
        it('should have all required form controls', () => {
            expect(component.recipeForm.get('name')).toBeDefined();
            expect(component.recipeForm.get('description')).toBeDefined();
            expect(component.recipeForm.get('category')).toBeDefined();
            expect(component.recipeForm.get('difficulty')).toBeDefined();
            expect(component.recipeForm.get('prepTime')).toBeDefined();
            expect(component.recipeForm.get('cookTime')).toBeDefined();
            expect(component.recipeForm.get('servings')).toBeDefined();
            expect(component.recipeForm.get('ingredients')).toBeDefined();
            expect(component.recipeForm.get('instructions')).toBeDefined();
        });

        it('should initialize with one ingredient and one instruction', () => {
            expect(component.ingredients.length).toBe(1);
            expect(component.instructions.length).toBe(1);
        });
    });

    describe('ingredient management', () => {
        it('should add an ingredient', () => {
            const initialLength = component.ingredients.length;
            component.addIngredient();
            expect(component.ingredients.length).toBe(initialLength + 1);
        });

        it('should remove an ingredient', () => {
            component.addIngredient();
            component.addIngredient();
            const initialLength = component.ingredients.length;
            component.removeIngredient(1);
            expect(component.ingredients.length).toBe(initialLength - 1);
        });

        it('should not remove ingredient if only one remains', () => {
            component.removeIngredient(0);
            expect(component.ingredients.length).toBe(1);
        });
    });

    describe('instruction management', () => {
        it('should add an instruction', () => {
            const initialLength = component.instructions.length;
            component.addInstruction();
            expect(component.instructions.length).toBe(initialLength + 1);
        });

        it('should remove an instruction', () => {
            component.addInstruction();
            component.addInstruction();
            const initialLength = component.instructions.length;
            component.removeInstruction(1);
            expect(component.instructions.length).toBe(initialLength - 1);
        });

        it('should not remove instruction if only one remains', () => {
            component.removeInstruction(0);
            expect(component.instructions.length).toBe(1);
        });
    });

    describe('form validation', () => {
        it('should be invalid when empty', () => {
            expect(component.recipeForm.valid).toBe(false);
        });

        it('should validate name length', () => {
            const nameControl = component.recipeForm.get('name');
            nameControl?.setValue('ab');
            expect(nameControl?.hasError('minlength')).toBe(true);
        });

        it('should validate description length', () => {
            const descControl = component.recipeForm.get('description');
            descControl?.setValue('short');
            expect(descControl?.hasError('minlength')).toBe(true);
        });

        it('should validate prepTime minimum', () => {
            const prepTimeControl = component.recipeForm.get('prepTime');
            prepTimeControl?.setValue(0);
            expect(prepTimeControl?.hasError('min')).toBe(true);
        });
    });

    describe('onSubmit', () => {
        beforeEach(() => {
            component.recipeForm.patchValue({
                name: 'Test Recipe',
                description: 'A great test recipe description',
                category: 'Test',
                difficulty: 'easy',
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                imageUrl: '',
            });
            component.ingredients.at(0).setValue('Test Ingredient');
            component.instructions.at(0).setValue('Test Instruction');
        });

        it('should create a recipe when form is valid in create mode', () => {
            component.onSubmit();

            expect(mockRecipeService.createRecipe).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes', mockRecipe.id]);
        });

        it('should update a recipe when form is valid in edit mode', () => {
            mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
            component.ngOnInit();
            component.isEditMode.set(true);
            component.recipeId.set('1');

            component.onSubmit();

            expect(mockRecipeService.updateRecipe).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes', mockRecipe.id]);
        });

        it('should not submit when form is invalid', () => {
            component.recipeForm.patchValue({
                name: '',
                description: '',
            });

            component.onSubmit();

            expect(mockRecipeService.createRecipe).not.toHaveBeenCalled();
            expect(mockRecipeService.updateRecipe).not.toHaveBeenCalled();
        });

        it('should handle errors during submission', () => {
            mockRecipeService.createRecipe.mockImplementation(() => {
                throw new Error('Creation failed');
            });

            component.onSubmit();

            expect(component.errorMessage()).toBe('Creation failed');
        });
    });

    describe('field validation helpers', () => {
        it('should check if field is invalid', () => {
            const nameControl = component.recipeForm.get('name');
            nameControl?.markAsTouched();
            nameControl?.setValue('');

            expect(component.isFieldInvalid('name')).toBe(true);
        });

        it('should get field error message for required', () => {
            const nameControl = component.recipeForm.get('name');
            nameControl?.setValue('');
            nameControl?.markAsTouched();

            expect(component.getFieldError('name')).toBe('Este campo es obligatorio');
        });

        it('should get field error message for minlength', () => {
            const nameControl = component.recipeForm.get('name');
            nameControl?.setValue('ab');
            nameControl?.markAsTouched();

            expect(component.getFieldError('name')).toContain('longitud mínima');
        });

        it('should get field error message for min', () => {
            const prepTimeControl = component.recipeForm.get('prepTime');
            prepTimeControl?.setValue(0);
            prepTimeControl?.markAsTouched();

            expect(component.getFieldError('prepTime')).toContain('valor mínimo');
        });
    });
});
