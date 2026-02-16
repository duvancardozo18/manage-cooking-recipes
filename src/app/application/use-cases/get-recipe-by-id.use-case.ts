import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

export class GetRecipeByIdUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(id: string): Recipe | null {
        return this.repository.findById(id);
    }
}
