import { Injectable, Inject } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { UpdateRecipeInput } from '../interfaces/recipe-inputs.interface';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class UpdateRecipeUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(id: string, data: UpdateRecipeInput): Recipe {
        const existingRecipe = this.repository.findById(id);

        if (!existingRecipe) {
            throw new Error('Recipe not found');
        }

        if (data.description !== undefined && typeof data.description === 'string' && data.description.trim().length < 10) {
            throw new Error('Recipe description must be at least 10 characters');
        }

        const updatedRecipe = new Recipe(
            existingRecipe.id,
            data.name !== undefined ? RecipeName.create(data.name) : existingRecipe.name,
            data.description ?? existingRecipe.description,
            data.ingredients ?? existingRecipe.ingredients,
            data.instructions ?? existingRecipe.instructions,
            data.prepTime !== undefined ? CookingTime.create(data.prepTime) : existingRecipe.prepTime,
            data.cookTime !== undefined ? CookingTime.create(data.cookTime) : existingRecipe.cookTime,
            data.servings !== undefined ? Servings.create(data.servings) : existingRecipe.servings,
            data.difficulty !== undefined ? Difficulty.create(data.difficulty) : existingRecipe.difficulty,
            data.category !== undefined ? Category.create(data.category) : existingRecipe.category,
            data.imageUrl !== undefined ? data.imageUrl : existingRecipe.imageUrl,
            existingRecipe.createdAt,
            new Date()
        );
        return this.repository.update(updatedRecipe);
    }
}
