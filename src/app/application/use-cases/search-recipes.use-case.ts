import { Injectable, Inject } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class SearchRecipesUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(query: string): Recipe[] {
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return this.repository.findAll();
        }

        return this.repository.search(query);
    }
}
