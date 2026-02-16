import { Recipe, RecipeUpdateData } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

export class UpdateRecipeUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(id: string, data: RecipeUpdateData): Recipe {
        const existingRecipe = this.repository.findById(id);

        if (!existingRecipe) {
            throw new Error('Recipe not found');
        }

        if (data.name !== undefined && data.name.trim().length < 3) {
            throw new Error('Recipe name must be at least 3 characters');
        }

        if (data.description !== undefined && data.description.trim().length < 10) {
            throw new Error('Recipe description must be at least 10 characters');
        }

        if (data.prepTime !== undefined && data.prepTime < 1) {
            throw new Error('Preparation time must be at least 1 minute');
        }

        if (data.cookTime !== undefined && data.cookTime < 1) {
            throw new Error('Cooking time must be at least 1 minute');
        }

        if (data.servings !== undefined && data.servings < 1) {
            throw new Error('Servings must be at least 1');
        }

        const updatedRecipe = existingRecipe.update(data);
        return this.repository.update(updatedRecipe);
    }
}
