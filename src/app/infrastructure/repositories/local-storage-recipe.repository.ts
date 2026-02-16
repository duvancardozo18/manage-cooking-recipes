import { Injectable } from '@angular/core';
import { Recipe, RecipeMapper, RecipeDto } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageRecipeRepository implements RecipeRepository {
    private readonly STORAGE_KEY = 'recipes';

    constructor() {
        // Initialize with sample data if empty
        if (!this.hasData()) {
            this.initializeWithSampleData();
        }
    }

    findAll(): Recipe[] {
        const dtos = this.loadFromStorage();
        return dtos.map(dto => RecipeMapper.toDomain(dto));
    }

    findById(id: string): Recipe | null {
        const recipes = this.findAll();
        return recipes.find(r => r.id === id) || null;
    }

    save(recipe: Recipe): Recipe {
        const recipes = this.findAll();
        recipes.push(recipe);
        this.saveToStorage(recipes);
        return recipe;
    }

    update(recipe: Recipe): Recipe {
        const recipes = this.findAll();
        const index = recipes.findIndex(r => r.id === recipe.id);

        if (index === -1) {
            throw new Error('Recipe not found');
        }

        recipes[index] = recipe;
        this.saveToStorage(recipes);
        return recipe;
    }

    delete(id: string): boolean {
        const recipes = this.findAll();
        const initialLength = recipes.length;
        const filtered = recipes.filter(r => r.id !== id);

        if (filtered.length === initialLength) {
            return false;
        }

        this.saveToStorage(filtered);
        return true;
    }

    findByCategory(category: string): Recipe[] {
        if (!category) return this.findAll();
        return this.findAll().filter(r => r.category === category);
    }

    findByDifficulty(difficulty: string): Recipe[] {
        if (!difficulty) return this.findAll();
        return this.findAll().filter(r => r.difficulty === difficulty);
    }

    search(query: string): Recipe[] {
        const lowerQuery = query.toLowerCase();
        return this.findAll().filter(recipe =>
            recipe.name.toLowerCase().includes(lowerQuery) ||
            recipe.description.toLowerCase().includes(lowerQuery) ||
            recipe.category.toLowerCase().includes(lowerQuery)
        );
    }

    private loadFromStorage(): RecipeDto[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            return [];
        }

        try {
            const recipes = JSON.parse(stored);
            return recipes.map((r: any) => ({
                ...r,
                createdAt: new Date(r.createdAt),
                updatedAt: new Date(r.updatedAt)
            }));
        } catch (error) {
            console.error('Error loading recipes from storage:', error);
            return [];
        }
    }

    private saveToStorage(recipes: Recipe[]): void {
        const dtos = recipes.map(r => RecipeMapper.toDto(r));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dtos));
    }

    private hasData(): boolean {
        return !!localStorage.getItem(this.STORAGE_KEY);
    }

    private initializeWithSampleData(): void {
        const sampleRecipes: RecipeDto[] = [
            {
                id: '1',
                name: 'Tortilla Española',
                description: 'Clásica tortilla española con papas y huevo',
                ingredients: [
                    '4 papas medianas',
                    '6 huevos',
                    '1 cebolla',
                    'Aceite de oliva',
                    'Sal'
                ],
                instructions: [
                    'Pelar y cortar las papas en rodajas finas',
                    'Picar la cebolla',
                    'Freír las papas y la cebolla en aceite hasta que estén blandas',
                    'Batir los huevos con sal',
                    'Mezclar las papas escurridas con los huevos batidos',
                    'Hacer la tortilla en una sartén con poco aceite',
                    'Dar la vuelta y cocinar por el otro lado'
                ],
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'easy',
                category: 'Española',
                imageUrl: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Arroz Blanco',
                description: 'Arroz blanco sencillo y perfecto',
                ingredients: [
                    '2 tazas de arroz',
                    '4 tazas de agua',
                    '1 cucharadita de sal',
                    '2 cucharadas de aceite'
                ],
                instructions: [
                    'Lavar el arroz con agua fría',
                    'Poner el agua a hervir con sal',
                    'Añadir el arroz y el aceite',
                    'Cocinar a fuego medio durante 15-18 minutos',
                    'Apagar el fuego y dejar reposar 5 minutos tapado',
                    'Servir caliente'
                ],
                prepTime: 5,
                cookTime: 18,
                servings: 4,
                difficulty: 'easy',
                category: 'Básica',
                imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                name: 'Tostadas con Tomate',
                description: 'Pan tostado con tomate, aceite y sal',
                ingredients: [
                    '4 rebanadas de pan',
                    '2 tomates maduros',
                    'Aceite de oliva',
                    'Sal'
                ],
                instructions: [
                    'Tostar el pan',
                    'Cortar el tomate por la mitad',
                    'Frotar el tomate sobre el pan tostado',
                    'Añadir un chorrito de aceite de oliva',
                    'Espolvorear con sal',
                    'Servir inmediatamente'
                ],
                prepTime: 5,
                cookTime: 3,
                servings: 2,
                difficulty: 'easy',
                category: 'Desayuno',
                imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleRecipes));
    }
}
