import { Injectable, Inject } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class FilterByCategoryUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(category: string): Recipe[] {
        if (!category || typeof category !== 'string' || category.trim().length === 0) {
            return [];
        }

        return this.repository.findByCategory(category);
    }
}
