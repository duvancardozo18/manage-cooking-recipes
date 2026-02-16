import { Recipe } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

export class GetAllRecipesUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(): Recipe[] {
        return this.repository.findAll();
    }
}
