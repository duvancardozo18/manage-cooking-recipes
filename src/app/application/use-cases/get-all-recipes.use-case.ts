import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

export class GetAllRecipesUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(): Recipe[] {
        return this.repository.findAll();
    }
}
