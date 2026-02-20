import { Injectable } from '@angular/core';
import { Recipe } from '../../domain/entities/recipe.entity';
import { CreateRecipeInput, UpdateRecipeInput } from '../interfaces/recipe-inputs.interface';
import { CreateRecipeUseCase } from '../use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from '../use-cases/delete-recipe.use-case';
import { GetAllRecipesUseCase } from '../use-cases/get-all-recipes.use-case';
import { GetRecipeByIdUseCase } from '../use-cases/get-recipe-by-id.use-case';
import { SearchRecipesUseCase } from '../use-cases/search-recipes.use-case';
import { UpdateRecipeUseCase } from '../use-cases/update-recipe.use-case';
import { FilterByCategoryUseCase } from '../use-cases/filter-by-category.use-case';
import { FilterByDifficultyUseCase } from '../use-cases/filter-by-difficulty.use-case';
import { GetCategoriesUseCase } from '../use-cases/get-categories.use-case';

@Injectable({
    providedIn: 'root'
})
export class RecipeApplicationService {
    constructor(
        private getAllRecipesUseCase: GetAllRecipesUseCase,
        private getRecipeByIdUseCase: GetRecipeByIdUseCase,
        private createRecipeUseCase: CreateRecipeUseCase,
        private updateRecipeUseCase: UpdateRecipeUseCase,
        private deleteRecipeUseCase: DeleteRecipeUseCase,
        private searchRecipesUseCase: SearchRecipesUseCase,
        private filterByCategoryUseCase: FilterByCategoryUseCase,
        private filterByDifficultyUseCase: FilterByDifficultyUseCase,
        private getCategoriesUseCase: GetCategoriesUseCase
    ) { }

    getRecipes(): Recipe[] {
        try {
            return this.getAllRecipesUseCase.execute();
        } catch (error) {
            console.error('Error getting recipes:', error);
            return [];
        }
    }

    getRecipeById(id: string): Recipe | null {
        try {
            return this.getRecipeByIdUseCase.execute(id);
        } catch (error) {
            console.error('Error getting recipe:', error);
            return null;
        }
    }

    createRecipe(data: CreateRecipeInput): Recipe {
        try {
            return this.createRecipeUseCase.execute(data);
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw error;
        }
    }

    updateRecipe(id: string, data: UpdateRecipeInput): Recipe {
        try {
            return this.updateRecipeUseCase.execute(id, data);
        } catch (error) {
            console.error('Error updating recipe:', error);
            throw error;
        }
    }

    deleteRecipe(id: string): boolean {
        try {
            return this.deleteRecipeUseCase.execute(id);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            return false;
        }
    }

    searchRecipes(query: string): Recipe[] {
        try {
            return this.searchRecipesUseCase.execute(query);
        } catch (error) {
            console.error('Error searching recipes:', error);
            return [];
        }
    }

    filterByCategory(category: string): Recipe[] {
        try {
            return this.filterByCategoryUseCase.execute(category);
        } catch (error) {
            console.error('Error filtering by category:', error);
            return [];
        }
    }

    filterByDifficulty(difficulty: string): Recipe[] {
        try {
            return this.filterByDifficultyUseCase.execute(difficulty);
        } catch (error) {
            console.error('Error filtering by difficulty:', error);
            return [];
        }
    }

    getCategories(): string[] {
        try {
            return this.getCategoriesUseCase.execute();
        } catch (error) {
            console.error('Error getting categories:', error);
            return [];
        }
    }
}
