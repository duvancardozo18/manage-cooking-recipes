import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

export class SearchRecipesUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(query: string): Recipe[] {
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return this.repository.findAll();
        }

        return this.repository.search(query);
    }
}
