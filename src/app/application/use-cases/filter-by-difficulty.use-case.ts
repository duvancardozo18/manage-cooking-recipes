import { Injectable, Inject } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class FilterByDifficultyUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(difficulty: string): Recipe[] {
        if (!difficulty || typeof difficulty !== 'string' || difficulty.trim().length === 0) {
            return [];
        }

        return this.repository.findByDifficulty(difficulty);
    }
}
