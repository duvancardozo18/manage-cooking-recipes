import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalStorageRecipeRepository } from './local-storage-recipe.repository';
import { Recipe, RecipeDto } from '../../domain/entities/recipe.entity';

describe('LocalStorageRecipeRepository', () => {
    let repository: LocalStorageRecipeRepository;
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {};

        globalThis.localStorage = {
            getItem: vi.fn((key: string) => localStorageMock[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                localStorageMock[key] = value;
            }),
            removeItem: vi.fn((key: string) => {
                delete localStorageMock[key];
            }),
            clear: vi.fn(() => {
                localStorageMock = {};
            }),
            length: 0,
            key: vi.fn()
        } as any;

        repository = new LocalStorageRecipeRepository();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Constructor and initialization', () => {
        it('should initialize with sample data when storage is empty', () => {
            const recipes = repository.findAll();

            expect(recipes.length).toBeGreaterThan(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        it('should not initialize sample data when storage has data', () => {
            const existingData: RecipeDto[] = [
                {
                    id: '999',
                    name: 'Existing Recipe',
                    description: 'Already in storage',
                    ingredients: ['Ing1'],
                    instructions: ['Step1'],
                    prepTime: 10,
                    cookTime: 20,
                    servings: 4,
                    difficulty: 'easy',
                    category: 'Test',
                    imageUrl: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            localStorageMock['recipes'] = JSON.stringify(existingData);
            const newRepo = new LocalStorageRecipeRepository();
            const recipes = newRepo.findAll();

            expect(recipes.length).toBe(1);
            expect(recipes[0].id).toBe('999');
        });
    });

    describe('findAll', () => {
        it('should return all recipes from storage', () => {
            const recipes = repository.findAll();

            expect(Array.isArray(recipes)).toBe(true);
            expect(recipes.length).toBeGreaterThan(0);
            expect(recipes[0]).toBeInstanceOf(Recipe);
        });

        it('should return empty array when storage is empty', () => {
            localStorageMock['recipes'] = JSON.stringify([]);
            const newRepo = new LocalStorageRecipeRepository();

            const recipes = newRepo.findAll();

            expect(recipes).toEqual([]);
        });

        it('should convert dates from JSON correctly', () => {
            const recipes = repository.findAll();

            expect(recipes[0].createdAt).toBeInstanceOf(Date);
            expect(recipes[0].updatedAt).toBeInstanceOf(Date);
        });

        it('should handle corrupted storage data gracefully', () => {
            localStorageMock['recipes'] = 'invalid json {]';
            const newRepo = new LocalStorageRecipeRepository();

            const recipes = newRepo.findAll();

            expect(recipes).toEqual([]);
        });
    });

    describe('findById', () => {
        it('should return recipe when found', () => {
            const allRecipes = repository.findAll();
            const firstRecipeId = allRecipes[0].id;

            const recipe = repository.findById(firstRecipeId);

            expect(recipe).not.toBeNull();
            expect(recipe?.id).toBe(firstRecipeId);
        });

        it('should return null when recipe not found', () => {
            const recipe = repository.findById('nonexistent-id');

            expect(recipe).toBeNull();
        });

        it('should return null for empty string id', () => {
            const recipe = repository.findById('');

            expect(recipe).toBeNull();
        });

        it('should find recipe by exact id match', () => {
            const allRecipes = repository.findAll();
            const targetId = allRecipes[0].id;

            const recipe = repository.findById(targetId);

            expect(recipe?.id).toBe(targetId);
        });
    });

    describe('save', () => {
        it('should add new recipe to storage', () => {
            const newRecipe = Recipe.create({
                name: 'New Recipe',
                description: 'A newly created recipe',
                ingredients: ['Ingredient 1', 'Ingredient 2'],
                instructions: ['Step 1', 'Step 2'],
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'easy',
                category: 'Test'
            });

            const saved = repository.save(newRecipe);
            const found = repository.findById(saved.id);

            expect(found).not.toBeNull();
            expect(found?.name).toBe('New Recipe');
        });

        it('should persist recipe to localStorage', () => {
            const newRecipe = Recipe.create({
                name: 'Persistent Recipe',
                description: 'This recipe should persist',
                ingredients: ['Ing'],
                instructions: ['Step'],
                prepTime: 5,
                cookTime: 10,
                servings: 2,
                difficulty: 'medium',
                category: 'Test'
            });

            repository.save(newRecipe);

            const found = repository.findById(newRecipe.id);
            expect(found).not.toBeNull();
            expect(found?.name).toBe('Persistent Recipe');
        });
    });

    describe('update', () => {
        it('should update existing recipe', () => {
            const recipes = repository.findAll();
            const existingRecipe = recipes[0];

            const updatedRecipe = existingRecipe.update({
                name: 'Updated Name',
                prepTime: 999
            });

            const result = repository.update(updatedRecipe);

            expect(result.name).toBe('Updated Name');
            expect(result.prepTime).toBe(999);

            const found = repository.findById(existingRecipe.id);
            expect(found?.name).toBe('Updated Name');
        });

        it('should throw error when updating non-existent recipe', () => {
            const fakeRecipe = new Recipe(
                'nonexistent-id',
                'Fake',
                'Fake recipe',
                ['Ing'],
                ['Step'],
                10,
                20,
                4,
                'easy',
                'Cat',
                null,
                new Date(),
                new Date()
            );

            expect(() => repository.update(fakeRecipe)).toThrow('Recipe not found');
        });

        it('should persist updates to localStorage', () => {
            const recipes = repository.findAll();
            const existingRecipe = recipes[0];
            const originalName = existingRecipe.name;

            const updatedRecipe = existingRecipe.update({ name: 'Changed Name' });
            repository.update(updatedRecipe);

            expect(localStorage.setItem).toHaveBeenCalled();

            // Verify persistence
            const found = repository.findById(existingRecipe.id);
            expect(found?.name).toBe('Changed Name');
            expect(found?.name).not.toBe(originalName);
        });
    });

    describe('delete', () => {
        it('should delete existing recipe and return true', () => {
            const recipes = repository.findAll();
            const recipeToDelete = recipes[0];
            const initialCount = recipes.length;

            const result = repository.delete(recipeToDelete.id);

            expect(result).toBe(true);
            expect(repository.findAll().length).toBe(initialCount - 1);
            expect(repository.findById(recipeToDelete.id)).toBeNull();
        });

        it('should return false when deleting non-existent recipe', () => {
            const result = repository.delete('nonexistent-id');

            expect(result).toBe(false);
        });

        it('should persist deletion to localStorage', () => {
            const recipes = repository.findAll();
            const recipeId = recipes[0].id;

            repository.delete(recipeId);

            expect(localStorage.setItem).toHaveBeenCalled();
            expect(repository.findById(recipeId)).toBeNull();
        });

        it('should not affect other recipes when deleting one', () => {
            const recipes = repository.findAll();
            if (recipes.length < 2) {
                // Add a recipe to ensure we have at least 2
                const newRecipe = Recipe.create({
                    name: 'Extra Recipe',
                    description: 'For testing',
                    ingredients: ['Ing'],
                    instructions: ['Step'],
                    prepTime: 10,
                    cookTime: 20,
                    servings: 4,
                    difficulty: 'easy',
                    category: 'Test'
                });
                repository.save(newRecipe);
            }

            const updatedRecipes = repository.findAll();
            const idToKeep = updatedRecipes[0].id;
            const idToDelete = updatedRecipes[1].id;

            repository.delete(idToDelete);

            expect(repository.findById(idToKeep)).not.toBeNull();
            expect(repository.findById(idToDelete)).toBeNull();
        });
    });

    describe('findByCategory', () => {
        it('should return recipes of specified category', () => {
            const allRecipes = repository.findAll();
            const category = allRecipes[0].category;

            const results = repository.findByCategory(category);

            expect(results.length).toBeGreaterThan(0);
            results.forEach((recipe) => {
                expect(recipe.category).toBe(category);
            });
        });

        it('should return all recipes when category is empty', () => {
            const allRecipes = repository.findAll();
            const results = repository.findByCategory('');

            expect(results.length).toBe(allRecipes.length);
        });

        it('should return empty array when category not found', () => {
            const results = repository.findByCategory('NonexistentCategory');

            expect(results).toEqual([]);
        });
    });

    describe('findByDifficulty', () => {
        it('should return recipes of specified difficulty', () => {
            const allRecipes = repository.findAll();
            const difficulty = allRecipes[0].difficulty;

            const results = repository.findByDifficulty(difficulty);

            expect(results.length).toBeGreaterThan(0);
            results.forEach((recipe) => {
                expect(recipe.difficulty).toBe(difficulty);
            });
        });

        it('should return all recipes when difficulty is empty', () => {
            const allRecipes = repository.findAll();
            const results = repository.findByDifficulty('');

            expect(results.length).toBe(allRecipes.length);
        });

        it('should handle all difficulty levels', () => {
            const difficulties = ['easy', 'medium', 'hard'];

            difficulties.forEach((difficulty) => {
                const results = repository.findByDifficulty(difficulty);
                results.forEach((recipe) => {
                    expect(['easy', 'medium', 'hard']).toContain(recipe.difficulty);
                });
            });
        });
    });

    describe('search', () => {
        it('should find recipes by name', () => {
            const allRecipes = repository.findAll();
            const searchTerm = allRecipes[0].name.substring(0, 5).toLowerCase();

            const results = repository.search(searchTerm);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find recipes by description', () => {
            const allRecipes = repository.findAll();
            const searchTerm = allRecipes[0].description.substring(0, 5).toLowerCase();

            const results = repository.search(searchTerm);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find recipes by category', () => {
            const allRecipes = repository.findAll();
            const searchTerm = allRecipes[0].category.toLowerCase();

            const results = repository.search(searchTerm);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should be case-insensitive', () => {
            const allRecipes = repository.findAll();
            const name = allRecipes[0].name;

            const resultsLower = repository.search(name.toLowerCase());
            const resultsUpper = repository.search(name.toUpperCase());
            const resultsMixed = repository.search(name);

            expect(resultsLower.length).toBeGreaterThan(0);
            expect(resultsUpper.length).toBeGreaterThan(0);
            expect(resultsMixed.length).toBeGreaterThan(0);
        });

        it('should return empty array when no matches found', () => {
            const results = repository.search('zzzznonexistenttermzzzz');

            expect(results).toEqual([]);
        });

        it('should handle partial matches', () => {
            const allRecipes = repository.findAll();
            const partialName = allRecipes[0].name.substring(0, 3);

            const results = repository.search(partialName);

            expect(results.length).toBeGreaterThan(0);
        });
    });
});
