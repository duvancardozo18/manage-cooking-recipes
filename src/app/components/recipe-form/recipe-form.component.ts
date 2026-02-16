import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { CreateRecipeDto, UpdateRecipeDto } from '../../infrastructure/dtos/recipe.dto';

@Component({
    selector: 'app-recipe-form',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './recipe-form.component.html',
    styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit, OnDestroy {
    recipeForm!: FormGroup;
    isEditMode = signal(false);
    recipeId = signal<string | null>(null);
    pageTitle = signal('Agregar Nueva Receta');
    errorMessage = signal<string | null>(null);

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipeApplicationService
    ) {
        console.log('RecipeFormComponent - Constructor llamado');
        this.initForm();
    }

    ngOnInit(): void {
        console.log(' RecipeFormComponent - ngOnInit ejecutado');
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.recipeId.set(id);
            this.pageTitle.set('Editar Receta');
            this.loadRecipe(id);
        }
    }

    ngOnDestroy(): void {
        console.log('RecipeFormComponent - ngOnDestroy ejecutado');
    }

    private initForm(): void {
        this.recipeForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            category: ['', Validators.required],
            difficulty: ['medium', Validators.required],
            prepTime: [0, [Validators.required, Validators.min(1)]],
            cookTime: [0, [Validators.required, Validators.min(1)]],
            servings: [1, [Validators.required, Validators.min(1)]],
            imageUrl: [''],
            ingredients: this.fb.array([this.createIngredientControl()]),
            instructions: this.fb.array([this.createInstructionControl()])
        });
    }

    private loadRecipe(id: string): void {
        const recipe = this.recipeService.getRecipeById(id);
        if (recipe) {
            // Clear existing arrays
            this.ingredients.clear();
            this.instructions.clear();

            // Add ingredients
            recipe.ingredients.forEach(ingredient => {
                this.ingredients.push(this.fb.control(ingredient, Validators.required));
            });

            // Add instructions
            recipe.instructions.forEach(instruction => {
                this.instructions.push(this.fb.control(instruction, Validators.required));
            });

            // Patch form values
            this.recipeForm.patchValue({
                name: recipe.name,
                description: recipe.description,
                category: recipe.category,
                difficulty: recipe.difficulty,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
                servings: recipe.servings,
                imageUrl: recipe.imageUrl || ''
            });
        } else {
            this.router.navigate(['/recipes']);
        }
    }

    private createIngredientControl() {
        return this.fb.control('', Validators.required);
    }

    private createInstructionControl() {
        return this.fb.control('', Validators.required);
    }

    get ingredients(): FormArray {
        return this.recipeForm.get('ingredients') as FormArray;
    }

    get instructions(): FormArray {
        return this.recipeForm.get('instructions') as FormArray;
    }

    addIngredient(): void {
        this.ingredients.push(this.createIngredientControl());
    }

    removeIngredient(index: number): void {
        if (this.ingredients.length > 1) {
            this.ingredients.removeAt(index);
        }
    }

    addInstruction(): void {
        this.instructions.push(this.createInstructionControl());
    }

    removeInstruction(index: number): void {
        if (this.instructions.length > 1) {
            this.instructions.removeAt(index);
        }
    }

    onSubmit(): void {
        if (this.recipeForm.valid) {
            const formData = this.recipeForm.value;

            // Filter out empty strings
            formData.ingredients = formData.ingredients.filter((i: string) => i.trim());
            formData.instructions = formData.instructions.filter((i: string) => i.trim());

            try {
                if (this.isEditMode() && this.recipeId()) {
                    const updateData: UpdateRecipeDto = {
                        name: formData.name,
                        description: formData.description,
                        category: formData.category,
                        difficulty: formData.difficulty,
                        prepTime: formData.prepTime,
                        cookTime: formData.cookTime,
                        servings: formData.servings,
                        imageUrl: formData.imageUrl || null,
                        ingredients: formData.ingredients,
                        instructions: formData.instructions
                    };

                    const updated = this.recipeService.updateRecipe(this.recipeId()!, updateData);
                    if (updated) {
                        this.router.navigate(['/recipes', updated.id]);
                    }
                } else {
                    const creationData: CreateRecipeDto = {
                        name: formData.name,
                        description: formData.description,
                        category: formData.category,
                        difficulty: formData.difficulty,
                        prepTime: formData.prepTime,
                        cookTime: formData.cookTime,
                        servings: formData.servings,
                        imageUrl: formData.imageUrl,
                        ingredients: formData.ingredients,
                        instructions: formData.instructions
                    };

                    const newRecipe = this.recipeService.createRecipe(creationData);
                    if (newRecipe) {
                        this.router.navigate(['/recipes', newRecipe.id]);
                    }
                }
                this.errorMessage.set(null);
            } catch (error) {
                this.errorMessage.set(error instanceof Error ? error.message : 'Ocurrió un error');
            }
        } else {
            this.markFormGroupTouched(this.recipeForm);
        }
    }

    private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            }
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.recipeForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.recipeForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `La longitud mínima es de ${minLength} caracteres`;
        }
        if (field?.hasError('min')) {
            const min = field.errors?.['min'].min;
            return `El valor mínimo es ${min}`;
        }
        return '';
    }
}
