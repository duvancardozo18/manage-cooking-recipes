import { InjectionToken, inject } from '@angular/core';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { ApiRecipeRepository } from '../../infrastructure/repositories/api-recipe.repository';
// import { LocalStorageRecipeRepository } from '../../infrastructure/repositories/local-storage-recipe.repository';


export const RECIPE_REPOSITORY = new InjectionToken<RecipeRepository>(
    'RecipeRepository',
    {
        providedIn: 'root',
        factory: () => {
            return inject(ApiRecipeRepository);
            // return inject(LocalStorageRecipeRepository); //localStorage 
        }
    }
);
