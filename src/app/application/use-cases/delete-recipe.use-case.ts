import { Injectable, Inject } from '@angular/core';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class DeleteRecipeUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(id: string): boolean {
        const recipe = this.repository.findById(id);
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        return this.repository.delete(id);
    }
}
