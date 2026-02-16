import { Recipe } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

export class SearchRecipesUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(query: string): Recipe[] {
        if (!query || query.trim().length === 0) {
            return this.repository.findAll();
        }

        return this.repository.search(query);
    }
}
