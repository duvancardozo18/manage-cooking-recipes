import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RecipeMapper } from '../mappers/recipe.mapper';
import { firstValueFrom, Subject } from 'rxjs';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';


@Injectable({
    providedIn: 'root'
})
export class ApiRecipeRepository implements RecipeRepository {
    private readonly API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
    private readonly STORAGE_KEY = 'api_recipes_cache';
    private http = inject(HttpClient);
    private recipesCache: Recipe[] = [];
    private isInitialized = false;

    // Subject para notificar cuando los datos estén cargados
    private recipesLoadedSubject = new Subject<void>();
    public recipesLoaded$ = this.recipesLoadedSubject.asObservable();

    constructor() {
        const cached = this.loadFromCache();
        if (cached.length > 0) {
            this.recipesCache = cached;
            this.isInitialized = true;
        } else {
            console.log('No cache found, fetching from API...');
            this.fetchFromApiInBackground();
        }
    }

    private async fetchFromApiInBackground(): Promise<void> {
        try {
            console.log('Fetching recipes from TheMealDB API in background...');

            // Fetch from API (Spanish recipes categories)
            const categories = ['Beef', 'Chicken', 'Pasta', 'Seafood', 'Vegetarian', 'Dessert'];
            const allRecipes: Recipe[] = [];

            for (const category of categories) {
                try {
                    const response: any = await firstValueFrom(
                        this.http.get(`${this.API_BASE_URL}/filter.php?c=${category}`)
                    );

                    if (response.meals) {
                        // Get first 3 recipes from each category
                        const meals = response.meals.slice(0, 3);

                        for (const meal of meals) {
                            // Get detailed recipe info
                            const detailResponse: any = await firstValueFrom(
                                this.http.get(`${this.API_BASE_URL}/lookup.php?i=${meal.idMeal}`)
                            );

                            if (detailResponse.meals && detailResponse.meals[0]) {
                                const recipe = this.mapApiRecipeToEntity(detailResponse.meals[0], category);
                                allRecipes.push(recipe);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching recipes for category ${category}:`, error);
                }
            }

            if (allRecipes.length > 0) {
                this.recipesCache = allRecipes;
                this.saveToCache(allRecipes);
                this.isInitialized = true;
                console.log(`Loaded ${allRecipes.length} recipes from TheMealDB API`);
                // Notificar que los datos están disponibles
                this.recipesLoadedSubject.next();
            }
        } catch (error) {
            console.error('Error fetching from API:', error);
            // Keep using existing cache/sample data
        }
    }

    private mapApiRecipeToEntity(apiMeal: any, category: string): Recipe {
        // Extract ingredients and measurements
        const ingredients: string[] = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = apiMeal[`strIngredient${i}`];
            const measure = apiMeal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure || ''} ${ingredient}`.trim());
            }
        }

        // Extract instructions from API
        const instructionsText = apiMeal.strInstructions || '';
        const instructions = instructionsText
            .split(/\r\n|\n|\r/)
            .filter((step: string) => step.trim().length > 0)
            .map((step: string) => step.trim());

        // Map difficulty based on number of ingredients
        let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
        if (ingredients.length <= 5) difficulty = 'easy';
        else if (ingredients.length >= 10) difficulty = 'hard';

        return new Recipe(
            apiMeal.idMeal,
            RecipeName.create(apiMeal.strMeal || 'Sin nombre'),
            `Receta de ${apiMeal.strMeal}. ${instructionsText.substring(0, 150)}...`,
            ingredients,
            instructions.length > 0 ? instructions : ['Preparar según las instrucciones'],
            CookingTime.create(15),
            CookingTime.create(30),
            Servings.create(4),
            Difficulty.create(difficulty),
            Category.create(this.translateCategory(category)),
            apiMeal.strMealThumb || '',
            new Date(),
            new Date()
        );
    }

    private translateCategory(category: string): string {
        const translations: Record<string, string> = {
            'Beef': 'Carne',
            'Chicken': 'Pollo',
            'Pasta': 'Pastas',
            'Seafood': 'Mariscos',
            'Vegetarian': 'Vegetariano',
            'Dessert': 'Postres',
        };
        return translations[category] || category;
    }

    findAll(): Recipe[] {
        return [...this.recipesCache];
    }

    findById(id: string): Recipe | null {
        return this.recipesCache.find(r => r.id === id) || null;
    }

    save(recipe: Recipe): Recipe {
        this.recipesCache.push(recipe);
        this.saveToCache(this.recipesCache);
        return recipe;
    }

    update(recipe: Recipe): Recipe {
        const index = this.recipesCache.findIndex(r => r.id === recipe.id);
        if (index === -1) {
            throw new Error('Recipe not found');
        }
        this.recipesCache[index] = recipe;
        this.saveToCache(this.recipesCache);
        return recipe;
    }

    delete(id: string): boolean {
        const initialLength = this.recipesCache.length;
        this.recipesCache = this.recipesCache.filter(r => r.id !== id);
        const deleted = this.recipesCache.length < initialLength;
        if (deleted) {
            this.saveToCache(this.recipesCache);
        }
        return deleted;
    }

    findByCategory(category: string): Recipe[] {
        if (!category || category.trim() === '') {
            return this.findAll();
        }
        return this.recipesCache.filter(r =>
            r.category.getValue().toLowerCase() === category.toLowerCase()
        );
    }

    findByDifficulty(difficulty: string): Recipe[] {
        if (!difficulty || difficulty.trim() === '') {
            return this.findAll();
        }
        return this.recipesCache.filter(r =>
            r.difficulty.getValue().toLowerCase() === difficulty.toLowerCase()
        );
    }

    search(query: string): Recipe[] {
        const lowerQuery = query.toLowerCase();
        return this.recipesCache.filter(r =>
            r.name.getValue().toLowerCase().includes(lowerQuery) ||
            r.description.toLowerCase().includes(lowerQuery) ||
            r.category.getValue().toLowerCase().includes(lowerQuery) ||
            r.ingredients.some(i => i.toLowerCase().includes(lowerQuery))
        );
    }

    private saveToCache(recipes: Recipe[]): void {
        try {
            const dtos = recipes.map(r => RecipeMapper.toDto(r));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dtos));
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    private loadFromCache(): Recipe[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return [];
            const dtos = JSON.parse(data);
            return dtos.map((dto: any) => RecipeMapper.toDomain(dto));
        } catch (error) {
            console.error('Error loading from cache:', error);
            return [];
        }
    }
}
