import { Recipe, RecipeCreationData } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

export class CreateRecipeUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(data: RecipeCreationData): Recipe {
        
        if (!data.name || data.name.trim().length < 3) {
            throw new Error('Recipe name must be at least 3 characters');
        }

        if (!data.description || data.description.trim().length < 10) {
            throw new Error('Recipe description must be at least 10 characters');
        }

        if (!data.ingredients || data.ingredients.length === 0) {
            throw new Error('Recipe must have at least one ingredient');
        }

        if (!data.instructions || data.instructions.length === 0) {
            throw new Error('Recipe must have at least one instruction');
        }

        if (data.prepTime < 1 || data.cookTime < 1) {
            throw new Error('Preparation and cooking time must be at least 1 minute');
        }

        if (data.servings < 1) {
            throw new Error('Servings must be at least 1');
        }

        const recipe = Recipe.create(data);
        return this.repository.save(recipe);
    }
}
