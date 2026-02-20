import { Injectable, Inject } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

@Injectable({
    providedIn: 'root'
})
export class GetAllRecipesUseCase {
    constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) { }

    execute(): Recipe[] {
        return this.repository.findAll();
    }
}
