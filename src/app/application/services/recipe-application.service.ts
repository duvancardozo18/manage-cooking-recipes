import { Injectable, signal, computed, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Recipe } from '../../domain/entities/recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto } from '../../infrastructure/dtos/recipe.dto';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { CreateRecipeUseCase } from '../use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from '../use-cases/delete-recipe.use-case';
import { GetAllRecipesUseCase } from '../use-cases/get-all-recipes.use-case';
import { GetRecipeByIdUseCase } from '../use-cases/get-recipe-by-id.use-case';
import { SearchRecipesUseCase } from '../use-cases/search-recipes.use-case';
import { UpdateRecipeUseCase } from '../use-cases/update-recipe.use-case';
import { RECIPE_REPOSITORY } from '../../core/tokens/repository.tokens';


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

    // Observer Pattern: Subject para notificar cuando se agrega una nueva receta
    private recipeAddedSubject = new Subject<Recipe>();
    // Observable público para que los componentes se suscriban
    public recipeAdded$ = this.recipeAddedSubject.asObservable();

    // Observer Pattern: Subject para notificar cuando se actualiza una receta
    private recipeUpdatedSubject = new Subject<Recipe>();
    public recipeUpdated$ = this.recipeUpdatedSubject.asObservable();

    // Observer Pattern: Subject para notificar cuando se elimina una receta
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

        // Suscribirse a las actualizaciones del repositorio cuando los datos se carguen desde la API
        if ('recipesLoaded$' in this.repository) {
            const apiRepository = this.repository as any;
            apiRepository.recipesLoaded$.subscribe(() => {
                console.log('🔄 Recipes loaded from API, refreshing...');
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


    createRecipe(data: CreateRecipeDto): Recipe | null {
        try {
            const recipe = this.createRecipeUseCase.execute(data);
            this.loadRecipes();

            // Observer Pattern: Notificar a los observadores que se agregó una nueva receta
            this.recipeAddedSubject.next(recipe);

            return recipe;
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw error;
        }
    }

    updateRecipe(id: string, data: UpdateRecipeDto): Recipe | null {
        try {
            const recipe = this.updateRecipeUseCase.execute(id, data);
            this.loadRecipes(); // Refresh state

            // Observer Pattern: Notificar a los observadores que se actualizó una receta
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
            this.loadRecipes(); // Refresh state

            // Observer Pattern: Notificar a los observadores que se eliminó una receta
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
