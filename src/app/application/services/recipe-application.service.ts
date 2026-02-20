import { Injectable, signal, computed, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Recipe } from '../../domain/entities/recipe.entity';
import { CreateRecipeInput, UpdateRecipeInput } from '../interfaces/recipe-inputs.interface';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { CreateRecipeUseCase } from '../use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from '../use-cases/delete-recipe.use-case';
import { GetAllRecipesUseCase } from '../use-cases/get-all-recipes.use-case';
import { GetRecipeByIdUseCase } from '../use-cases/get-recipe-by-id.use-case';
import { SearchRecipesUseCase } from '../use-cases/search-recipes.use-case';
import { UpdateRecipeUseCase } from '../use-cases/update-recipe.use-case';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';


@Injectable({
    providedIn: 'root'
})
export class RecipeApplicationService {
    private getAllRecipesUseCase: GetAllRecipesUseCase;
    private getRecipeByIdUseCase: GetRecipeByIdUseCase;
    private createRecipeUseCase: CreateRecipeUseCase;
    private updateRecipeUseCase: UpdateRecipeUseCase;
    private deleteRecipeUseCase: DeleteRecipeUseCase;
    private searchRecipesUseCase: SearchRecipesUseCase;

    private recipeAddedSubject = new Subject<Recipe>();
    public recipeAdded$ = this.recipeAddedSubject.asObservable();
    private recipeUpdatedSubject = new Subject<Recipe>();
    public recipeUpdated$ = this.recipeUpdatedSubject.asObservable();
    private recipeDeletedSubject = new Subject<string>();
    public recipeDeleted$ = this.recipeDeletedSubject.asObservable();

    private recipesSignal = signal<Recipe[]>([]);

    constructor(
        @Inject(RECIPE_REPOSITORY) private repository: RecipeRepository
    ) {
        this.getAllRecipesUseCase = new GetAllRecipesUseCase(this.repository);
        this.getRecipeByIdUseCase = new GetRecipeByIdUseCase(this.repository);
        this.createRecipeUseCase = new CreateRecipeUseCase(this.repository);
        this.updateRecipeUseCase = new UpdateRecipeUseCase(this.repository);
        this.deleteRecipeUseCase = new DeleteRecipeUseCase(this.repository);
        this.searchRecipesUseCase = new SearchRecipesUseCase(this.repository);

        this.loadRecipes();

        if ('recipesLoaded$' in this.repository) {
            const apiRepository = this.repository as any;
            apiRepository.recipesLoaded$.subscribe(() => {
                console.log(' Recipes loaded from API, refreshing...');
                this.loadRecipes();
            });
        }
    }


    getRecipes() {
        return this.recipesSignal.asReadonly();
    }

    getRecipeById(id: string): Recipe | null {
        try {
            return this.getRecipeByIdUseCase.execute(id);
        } catch (error) {
            console.error('Error getting recipe:', error);
            return null;
        }
    }


    createRecipe(data: CreateRecipeInput): Recipe | null {
        try {
            const recipe = this.createRecipeUseCase.execute(data);
            this.loadRecipes();
            this.recipeAddedSubject.next(recipe);

            return recipe;
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw error;
        }
    }

    updateRecipe(id: string, data: UpdateRecipeInput): Recipe | null {
        try {
            const recipe = this.updateRecipeUseCase.execute(id, data);
            this.loadRecipes(); 
            if (recipe) {
                this.recipeUpdatedSubject.next(recipe);
            }

            return recipe;
        } catch (error) {
            console.error('Error updating recipe:', error);
            throw error;
        }
    }

    deleteRecipe(id: string): boolean {
        try {
            const result = this.deleteRecipeUseCase.execute(id);
            this.loadRecipes(); 
            if (result) {
                this.recipeDeletedSubject.next(id);
            }

            return result;
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
            return this.repository.findByCategory(category);
        } catch (error) {
            console.error('Error filtering by category:', error);
            return [];
        }
    }

    filterByDifficulty(difficulty: string): Recipe[] {
        try {
            return this.repository.findByDifficulty(difficulty);
        } catch (error) {
            console.error('Error filtering by difficulty:', error);
            return [];
        }
    }

    getCategories(): string[] {
        const recipes = this.recipesSignal();
        const categories = new Set(recipes.map(r => r.category.getValue()));
        return Array.from(categories).sort();
    }


    private loadRecipes(): void {
        try {
            const recipes = this.getAllRecipesUseCase.execute();
            this.recipesSignal.set(recipes);
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.recipesSignal.set([]);
        }
    }
}
