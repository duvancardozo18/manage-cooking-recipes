import { RecipeRepository } from '../../domain/repositories/recipe.repository';

export class DeleteRecipeUseCase {
    constructor(private repository: RecipeRepository) { }

    execute(id: string): boolean {
        const recipe = this.repository.findById(id);
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        return this.repository.delete(id);
    }
}
