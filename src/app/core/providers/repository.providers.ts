import { InjectionToken } from '@angular/core';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { ApiRecipeRepository } from '../../infrastructure/repositories/api-recipe.repository';
// import { LocalStorageRecipeRepository } from '../../infrastructure/repositories/local-storage-recipe.repository';


export const RECIPE_REPOSITORY = new InjectionToken<RecipeRepository>(
    'RecipeRepository',
    {
        providedIn: 'root',
        factory: () => {
            return new ApiRecipeRepository();
            // return new LocalStorageRecipeRepository(); //localStorage 
        }
    }
);
