import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecipeApplicationService } from './recipe-application.service';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { CreateRecipeDto, UpdateRecipeDto } from '../../infrastructure/dtos/recipe.dto';

describe('RecipeApplicationService', () => {
    let service: RecipeApplicationService;
    let mockRepository: RecipeRepository;
    let testRecipes: Recipe[];

    beforeEach(() => {
        // Mock localStorage for testing
        const localStorageMock: { [key: string]: string } = {};

        globalThis.localStorage = {
            getItem: vi.fn((key: string) => localStorageMock[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                localStorageMock[key] = value;
            }),
            removeItem: vi.fn((key: string) => {
                delete localStorageMock[key];
            }),
            clear: vi.fn(() => {
                Object.keys(localStorageMock).forEach((key) => delete localStorageMock[key]);
            }),
            length: 0,
            key: vi.fn()
        } as any;

        // Create test recipe data
        const now = new Date();
        testRecipes = [
            new Recipe(
                '1',
                'Pasta Carbonara',
                'Classic Italian pasta dish',
                ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
                ['Cook pasta', 'Mix eggs and cheese', 'Combine with hot pasta'],
                10,
                15,
                4,
                'easy',
                'Platos Principales',
                null,
                now,
                now
            ),
            new Recipe(
                '2',
                'Chocolate Cake',
                'Delicious chocolate dessert',
                ['Flour', 'Sugar', 'Cocoa', 'Eggs', 'Butter'],
                ['Mix dry ingredients', 'Add wet ingredients', 'Bake at 350°F'],
                20,
                30,
                8,
                'medium',
                'Postres',
                null,
                now,
                now
            ),
            new Recipe(
                '3',
                'Caesar Salad',
                'Fresh and crispy salad',
                ['Romaine lettuce', 'Croutons', 'Parmesan', 'Caesar dressing'],
                ['Wash lettuce', 'Tear into pieces', 'Add toppings', 'Toss with dressing'],
                15,
                0,
                2,
                'easy',
                'Ensaladas',
                null,
                now,
                now
            )
        ];

        // Create a mock repository with all required methods
        mockRepository = {
            findAll: vi.fn(() => [...testRecipes]),
            findById: vi.fn((id: string) => testRecipes.find(r => r.id === id) || null),
            save: vi.fn((recipe: Recipe) => {
                testRecipes.push(recipe);
                return recipe;
            }),
            update: vi.fn((recipe: Recipe) => {
                const index = testRecipes.findIndex(r => r.id === recipe.id);
                if (index !== -1) {
                    testRecipes[index] = recipe;
                }
                return recipe;
            }),
            delete: vi.fn((id: string) => {
                const index = testRecipes.findIndex(r => r.id === id);
                if (index !== -1) {
                    testRecipes.splice(index, 1);
                    return true;
                }
                return false;
            }),
            findByCategory: vi.fn((category: string) => {
                if (!category) return [...testRecipes];
                return testRecipes.filter(r => r.category === category);
            }),
            findByDifficulty: vi.fn((difficulty: string) => {
                if (!difficulty) return [...testRecipes];
                return testRecipes.filter(r => r.difficulty === difficulty);
            }),
            search: vi.fn((query: string) => {
                const lowerQuery = query.toLowerCase();
                return testRecipes.filter(r =>
                    r.name.toLowerCase().includes(lowerQuery) ||
                    r.description.toLowerCase().includes(lowerQuery) ||
                    r.category.toLowerCase().includes(lowerQuery)
                );
            })
        };

        service = new RecipeApplicationService(mockRepository);
    });

    describe('Constructor and initialization', () => {
        it('should be created', () => {
            expect(service).toBeDefined();
        });

        it('should load initial recipes', () => {
            const recipes = service.getRecipes()();

            expect(Array.isArray(recipes)).toBe(true);
            expect(recipes.length).toBeGreaterThan(0);
        });

        it('should initialize with sample data', () => {
            const recipes = service.getRecipes()();

            expect(recipes.length).toBeGreaterThanOrEqual(3);
            expect(recipes[0]).toBeInstanceOf(Recipe);
        });
    });

    describe('getRecipes', () => {
        it('should return a readonly signal', () => {
            const recipesSignal = service.getRecipes();

            expect(typeof recipesSignal).toBe('function');
            const recipes = recipesSignal();
            expect(Array.isArray(recipes)).toBe(true);
        });

        it('should return all recipes', () => {
            const recipes = service.getRecipes()();

            expect(recipes.length).toBeGreaterThan(0);
            recipes.forEach((recipe) => {
                expect(recipe).toBeInstanceOf(Recipe);
            });
        });
    });

    describe('getRecipeById', () => {
        it('should return recipe when it exists', () => {
            const recipes = service.getRecipes()();
            const existingId = recipes[0].id;

            const recipe = service.getRecipeById(existingId);

            expect(recipe).not.toBeNull();
            expect(recipe?.id).toBe(existingId);
        });

        it('should return null when recipe does not exist', () => {
            const recipe = service.getRecipeById('nonexistent-id');

            expect(recipe).toBeNull();
        });

        it('should handle empty string id', () => {
            const recipe = service.getRecipeById('');

            expect(recipe).toBeNull();
        });

        it('should return correct recipe details', () => {
            const recipes = service.getRecipes()();
            const firstRecipe = recipes[0];

            const recipe = service.getRecipeById(firstRecipe.id);

            expect(recipe?.name).toBe(firstRecipe.name);
            expect(recipe?.description).toBe(firstRecipe.description);
            expect(recipe?.category).toBe(firstRecipe.category);
        });
    });

    describe('createRecipe', () => {
        const validRecipeData: CreateRecipeDto = {
            name: 'Test Recipe',
            description: 'This is a test recipe with enough characters',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: ['Step 1', 'Step 2'],
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            difficulty: 'medium',
            category: 'Test Category',
            imageUrl: 'test.jpg'
        };

        it('should create a new recipe with valid data', () => {
            const initialCount = service.getRecipes()().length;

            const recipe = service.createRecipe(validRecipeData);

            expect(recipe).not.toBeNull();
            expect(recipe?.name).toBe(validRecipeData.name);
            expect(service.getRecipes()().length).toBe(initialCount + 1);
        });

        it('should update signal after creating recipe', () => {
            const recipe = service.createRecipe(validRecipeData);

            const recipes = service.getRecipes()();
            const found = recipes.find((r) => r.id === recipe?.id);

            expect(found).toBeDefined();
            expect(found?.name).toBe(validRecipeData.name);
        });

        it('should throw error for invalid recipe data', () => {
            const invalidData = { ...validRecipeData, name: 'AB' };

            expect(() => service.createRecipe(invalidData)).toThrow();
        });

        it('should throw error for missing ingredients', () => {
            const invalidData = { ...validRecipeData, ingredients: [] };

            expect(() => service.createRecipe(invalidData)).toThrow();
        });

        it('should throw error for missing instructions', () => {
            const invalidData = { ...validRecipeData, instructions: [] };

            expect(() => service.createRecipe(invalidData)).toThrow();
        });

        it('should create recipe without imageUrl', () => {
            const dataWithoutImage = { ...validRecipeData };
            delete dataWithoutImage.imageUrl;

            const recipe = service.createRecipe(dataWithoutImage);

            expect(recipe).not.toBeNull();
            expect(recipe?.imageUrl).toBeNull();
        });
    });

    describe('updateRecipe', () => {
        let existingRecipeId: string;

        beforeEach(() => {
            const recipes = service.getRecipes()();
            existingRecipeId = recipes[0].id;
        });

        it('should update existing recipe', () => {
            const updateData: UpdateRecipeDto = {
                name: 'Updated Recipe Name',
                prepTime: 15
            };

            const updatedRecipe = service.updateRecipe(existingRecipeId, updateData);

            expect(updatedRecipe).not.toBeNull();
            expect(updatedRecipe?.name).toBe('Updated Recipe Name');
            expect(updatedRecipe?.prepTime).toBe(15);
        });

        it('should update signal after updating recipe', () => {
            const updateData: UpdateRecipeDto = { name: 'Changed Name' };

            service.updateRecipe(existingRecipeId, updateData);

            const recipes = service.getRecipes()();
            const found = recipes.find((r) => r.id === existingRecipeId);

            expect(found?.name).toBe('Changed Name');
        });

        it('should throw error when updating non-existent recipe', () => {
            const updateData: UpdateRecipeDto = { name: 'New Name' };

            expect(() => service.updateRecipe('nonexistent-id', updateData)).toThrow();
        });

        it('should throw error for invalid update data', () => {
            const updateData: UpdateRecipeDto = { name: 'AB' };

            expect(() => service.updateRecipe(existingRecipeId, updateData)).toThrow();
        });

        it('should handle partial updates', () => {
            const originalRecipe = service.getRecipeById(existingRecipeId);
            const updateData: UpdateRecipeDto = { prepTime: 999 };

            const updated = service.updateRecipe(existingRecipeId, updateData);

            expect(updated?.prepTime).toBe(999);
            expect(updated?.name).toBe(originalRecipe?.name);
            expect(updated?.description).toBe(originalRecipe?.description);
        });
    });

    describe('deleteRecipe', () => {
        it('should delete existing recipe', () => {
            const recipes = service.getRecipes()();
            const recipeToDelete = recipes[0];
            const initialCount = recipes.length;

            const result = service.deleteRecipe(recipeToDelete.id);

            expect(result).toBe(true);
            expect(service.getRecipes()().length).toBe(initialCount - 1);
        });

        it('should update signal after deleting recipe', () => {
            const recipes = service.getRecipes()();
            const recipeId = recipes[0].id;

            service.deleteRecipe(recipeId);

            const updatedRecipes = service.getRecipes()();
            const found = updatedRecipes.find((r) => r.id === recipeId);

            expect(found).toBeUndefined();
        });

        it('should return false when deleting non-existent recipe', () => {
            const result = service.deleteRecipe('nonexistent-id');

            expect(result).toBe(false);
        });

        it('should not affect other recipes when deleting one', () => {
            const recipes = service.getRecipes()();
            const idToDelete = recipes[0].id;
            const idToKeep = recipes[1].id;

            service.deleteRecipe(idToDelete);

            const found = service.getRecipeById(idToKeep);
            expect(found).not.toBeNull();
        });
    });

    describe('searchRecipes', () => {
        it('should find recipes by search query', () => {
            const recipes = service.getRecipes()();
            const searchTerm = recipes[0].name.substring(0, 5);

            const results = service.searchRecipes(searchTerm);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should return all recipes for empty query', () => {
            const allRecipes = service.getRecipes()();
            const results = service.searchRecipes('');

            expect(results.length).toBe(allRecipes.length);
        });

        it('should return empty array for non-matching query', () => {
            const results = service.searchRecipes('zzznonexistentzzz');

            expect(results).toEqual([]);
        });

        it('should be case-insensitive', () => {
            const recipes = service.getRecipes()();
            const name = recipes[0].name;

            const resultsLower = service.searchRecipes(name.toLowerCase());
            const resultsUpper = service.searchRecipes(name.toUpperCase());

            expect(resultsLower.length).toBeGreaterThan(0);
            expect(resultsUpper.length).toBeGreaterThan(0);
        });

        it('should search in name, description, and category', () => {
            const recipes = service.getRecipes()();
            const recipe = recipes[0];

            const nameResults = service.searchRecipes(recipe.name.substring(0, 4));
            const categoryResults = service.searchRecipes(recipe.category);

            expect(nameResults.length).toBeGreaterThan(0);
            expect(categoryResults.length).toBeGreaterThan(0);
        });
    });

    describe('filterByCategory', () => {
        it('should return recipes of specified category', () => {
            const recipes = service.getRecipes()();
            const category = recipes[0].category;

            const results = service.filterByCategory(category);

            expect(results.length).toBeGreaterThan(0);
            results.forEach((recipe) => {
                expect(recipe.category).toBe(category);
            });
        });

        it('should return all recipes for empty category', () => {
            const allRecipes = service.getRecipes()();
            const results = service.filterByCategory('');

            expect(results.length).toBe(allRecipes.length);
        });

        it('should return empty array for non-existent category', () => {
            const results = service.filterByCategory('NonExistentCategory');

            expect(results).toEqual([]);
        });
    });

    describe('filterByDifficulty', () => {
        it('should return recipes of specified difficulty', () => {
            const recipes = service.getRecipes()();
            const difficulty = recipes[0].difficulty;

            const results = service.filterByDifficulty(difficulty);

            expect(results.length).toBeGreaterThan(0);
            results.forEach((recipe) => {
                expect(recipe.difficulty).toBe(difficulty);
            });
        });

        it('should return all recipes for empty difficulty', () => {
            const allRecipes = service.getRecipes()();
            const results = service.filterByDifficulty('');

            expect(results.length).toBe(allRecipes.length);
        });

        it('should handle all difficulty levels', () => {
            const difficulties = ['easy', 'medium', 'hard'];

            difficulties.forEach((difficulty) => {
                const results = service.filterByDifficulty(difficulty);
                results.forEach((recipe) => {
                    expect(['easy', 'medium', 'hard']).toContain(recipe.difficulty);
                });
            });
        });
    });

    describe('getCategories', () => {
        it('should return unique categories', () => {
            const categories = service.getCategories();

            expect(Array.isArray(categories)).toBe(true);
            expect(categories.length).toBeGreaterThan(0);

            const uniqueCategories = new Set(categories);
            expect(uniqueCategories.size).toBe(categories.length);
        });

        it('should return sorted categories', () => {
            const categories = service.getCategories();

            const sorted = [...categories].sort();
            expect(categories).toEqual(sorted);
        });

        it('should include all categories from recipes', () => {
            const recipes = service.getRecipes()();
            const expectedCategories = new Set(recipes.map((r) => r.category));

            const categories = service.getCategories();

            expectedCategories.forEach((cat) => {
                expect(categories).toContain(cat);
            });
        });
    });

    describe('Error handling', () => {
        it('should handle errors in getRecipeById gracefully', () => {
            const recipe = service.getRecipeById('invalid-id');

            expect(recipe).toBeNull();
        });

        it('should handle errors in searchRecipes gracefully', () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            // This should not throw
            const results = service.searchRecipes('test');

            expect(results).toBeDefined();
            consoleErrorSpy.mockRestore();
        });

        it('should handle errors in deleteRecipe gracefully', () => {
            const result = service.deleteRecipe('nonexistent');

            expect(result).toBe(false);
        });
    });

    describe('Observer Pattern - RxJS Observables', () => {
        it('should emit event when a new recipe is added', () => {
            return new Promise<void>((resolve) => {
                const recipeData: CreateRecipeDto = {
                    name: 'Test Recipe Observer',
                    description: 'Testing Observer Pattern with RxJS',
                    category: 'Postres',
                    difficulty: 'easy',
                    prepTime: 10,
                    cookTime: 20,
                    servings: 4,
                    imageUrl: undefined,
                    ingredients: ['Ingredient 1', 'Ingredient 2'],
                    instructions: ['Step 1', 'Step 2']
                };

                // Suscribirse al observable antes de crear la receta
                service.recipeAdded$.subscribe((recipe) => {
                    expect(recipe).toBeDefined();
                    expect(recipe.name).toBe('Test Recipe Observer');
                    expect(recipe.description).toBe('Testing Observer Pattern with RxJS');
                    resolve();
                });

                // Crear la receta debería emitir el evento
                service.createRecipe(recipeData);
            });
        });

        it('should emit event when a recipe is updated', () => {
            return new Promise<void>((resolve) => {
                const recipes = service.getRecipes()();
                const existingRecipe = recipes[0];

                const updateData: UpdateRecipeDto = {
                    name: 'Updated Recipe Name',
                    description: existingRecipe.description,
                    category: existingRecipe.category,
                    difficulty: existingRecipe.difficulty,
                    prepTime: existingRecipe.prepTime,
                    cookTime: existingRecipe.cookTime,
                    servings: existingRecipe.servings,
                    imageUrl: existingRecipe.imageUrl,
                    ingredients: existingRecipe.ingredients,
                    instructions: existingRecipe.instructions
                };

                // Suscribirse al observable antes de actualizar
                service.recipeUpdated$.subscribe((recipe) => {
                    expect(recipe).toBeDefined();
                    expect(recipe.name).toBe('Updated Recipe Name');
                    resolve();
                });

                // Actualizar la receta debería emitir el evento
                service.updateRecipe(existingRecipe.id, updateData);
            });
        });

        it('should emit event when a recipe is deleted', () => {
            return new Promise<void>((resolve) => {
                const recipes = service.getRecipes()();
                const recipeToDelete = recipes[0];

                // Suscribirse al observable antes de eliminar
                service.recipeDeleted$.subscribe((id) => {
                    expect(id).toBeDefined();
                    expect(id).toBe(recipeToDelete.id);
                    resolve();
                });

                // Eliminar la receta debería emitir el evento
                service.deleteRecipe(recipeToDelete.id);
            });
        });

        it('should allow multiple observers to subscribe to recipeAdded$', () => {
            const recipeData: CreateRecipeDto = {
                name: 'Multi Observer Test',
                description: 'Testing multiple observers',
                category: 'Postres',
                difficulty: 'medium',
                prepTime: 15,
                cookTime: 25,
                servings: 6,
                imageUrl: undefined,
                ingredients: ['Test Ingredient'],
                instructions: ['Test Step']
            };

            let observer1Called = false;
            let observer2Called = false;

            // Primer observador
            service.recipeAdded$.subscribe(() => {
                observer1Called = true;
            });

            // Segundo observador
            service.recipeAdded$.subscribe(() => {
                observer2Called = true;
            });

            service.createRecipe(recipeData);

            // Ambos observadores deberían ser notificados
            expect(observer1Called).toBe(true);
            expect(observer2Called).toBe(true);
        });

        it('should not emit when recipe creation fails', () => {
            const invalidData: CreateRecipeDto = {
                name: 'AB', // Too short, will fail validation
                description: 'Short', // Too short
                category: 'Test',
                difficulty: 'easy',
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                imageUrl: undefined,
                ingredients: [],
                instructions: []
            };

            let emitted = false;
            service.recipeAdded$.subscribe(() => {
                emitted = true;
            });

            try {
                service.createRecipe(invalidData);
            } catch (error) {
                // Expected to fail
            }

            expect(emitted).toBe(false);
        });
    });
});
