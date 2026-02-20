import { Injectable, Inject } from '@angular/core';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class GetCategoriesUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(): string[] {
        const recipes = this.repository.findAll();
        const categories = new Set(recipes.map(r => r.category.getValue()));
        return Array.from(categories).sort();
    }
}
