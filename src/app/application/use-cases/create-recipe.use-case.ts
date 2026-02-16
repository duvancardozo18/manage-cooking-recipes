import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { CreateRecipeInput } from '../interfaces/recipe-inputs.interface';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

export class CreateRecipeUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(data: CreateRecipeInput): Recipe {

        if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
            throw new Error('Recipe description must be at least 10 characters');
        }

        if (!data.ingredients || data.ingredients.length === 0) {
            throw new Error('Recipe must have at least one ingredient');
        }

        if (!data.instructions || data.instructions.length === 0) {
            throw new Error('Recipe must have at least one instruction');
        }

        const now = new Date();
        const recipe = new Recipe(
            Date.now().toString(),
            RecipeName.create(data.name),
            data.description,
            data.ingredients,
            data.instructions,
            CookingTime.create(data.prepTime),
            CookingTime.create(data.cookTime),
            Servings.create(data.servings),
            Difficulty.create(data.difficulty),
            Category.create(data.category),
            data.imageUrl || null,
            now,
            now
        );
        return this.repository.save(recipe);
    }
}
