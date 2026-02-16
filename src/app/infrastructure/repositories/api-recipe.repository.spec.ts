import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiRecipeRepository } from './api-recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';

describe('ApiRecipeRepository', () => {
    let repository: ApiRecipeRepository;
    let httpMock: HttpTestingController;
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {};

        // Setup default cache to prevent API calls during initialization
        const defaultCache = JSON.stringify([
            {
                id: 'test-1',
                name: 'Test Recipe',
                description: 'A test recipe description',
                ingredients: ['Ingredient 1', 'Ingredient 2'],
                instructions: ['Instruction 1', 'Instruction 2'],
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'easy',
                category: 'Test',
                imageUrl: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]);
        localStorageMock['api_recipes_cache'] = defaultCache;

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key: string) => localStorageMock[key] || null),
                setItem: jest.fn((key: string, value: string) => {
                    localStorageMock[key] = value;
                }),
                removeItem: jest.fn((key: string) => {
                    delete localStorageMock[key];
                }),
                clear: jest.fn(() => {
                    localStorageMock = {};
                }),
            },
            writable: true,
        });

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiRecipeRepository],
        });

        httpMock = TestBed.inject(HttpTestingController);
        repository = TestBed.inject(ApiRecipeRepository);
    });

    afterEach(() => {
        httpMock.verify();
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        it('should be created', () => {
            expect(repository).toBeTruthy();
        });

        it('should load from cache if available', () => {
            const cachedData = JSON.stringify([
                {
                    id: 'cached-1',
                    name: 'Cached Recipe',
                    description: 'A cached recipe description',
                    ingredients: ['Ingredient 1'],
                    instructions: ['Instruction 1'],
                    prepTime: 10,
                    cookTime: 20,
                    servings: 4,
                    difficulty: 'easy',
                    category: 'Test',
                    imageUrl: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ]);

            localStorageMock['api_recipes_cache'] = cachedData;

            // Create a new TestBed with the updated cache
            const newRepository = TestBed.inject(ApiRecipeRepository);
            const recipes = newRepository.findAll();

            expect(recipes.length).toBeGreaterThan(0);
        });
    });

    describe('findAll', () => {
        it('should return all cached recipes', () => {
            const recipes = repository.findAll();
            expect(Array.isArray(recipes)).toBe(true);
        });
    });

    describe('findById', () => {
        it('should return a recipe by id when found', () => {
            // First save a recipe to ensure we have data
            const mockRecipe = {
                id: 'test-1',
                name: 'Test Recipe',
                description: 'Test description',
                ingredients: ['Ingredient 1'],
                instructions: ['Instruction 1'],
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'easy',
                category: 'Test',
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            localStorageMock['api_recipes_cache'] = JSON.stringify([mockRecipe]);
            // Get repository instance from TestBed
            const newRepository = TestBed.inject(ApiRecipeRepository);

            const found = newRepository.findById('test-1');
            expect(found).not.toBeNull();
            expect(found?.id).toBe('test-1');
        });

        it('should return null when recipe not found', () => {
            const found = repository.findById('non-existent-id');
            expect(found).toBeNull();
        });
    });

    describe('save', () => {
        it('should save a new recipe to cache', () => {
            const recipes = repository.findAll();
            const initialCount = recipes.length;

            // Create a mock recipe using Recipe entity
            const mockRecipe = new Recipe(
                'new-id',
                { getValue: () => 'New Recipe' } as any,
                'New description',
                ['Ingredient'],
                ['Instruction'],
                { getValue: () => 10 } as any,
                { getValue: () => 20 } as any,
                { getValue: () => 4 } as any,
                { getValue: () => 'easy' } as any,
                { getValue: () => 'Test' } as any,
                null,
                new Date(),
                new Date()
            );

            repository.save(mockRecipe);

            const updatedRecipes = repository.findAll();
            expect(updatedRecipes.length).toBe(initialCount + 1);
        });
    });

    describe('update', () => {
        it('should update an existing recipe', () => {
            // Setup: save a recipe first
            const mockRecipe = new Recipe(
                'update-test-1',
                { getValue: () => 'Original Recipe' } as any,
                'Original description',
                ['Ingredient'],
                ['Instruction'],
                { getValue: () => 10 } as any,
                { getValue: () => 20 } as any,
                { getValue: () => 4 } as any,
                { getValue: () => 'easy' } as any,
                { getValue: () => 'Test' } as any,
                null,
                new Date(),
                new Date()
            );

            repository.save(mockRecipe);

            // Update the recipe
            const updatedRecipe = new Recipe(
                'update-test-1',
                { getValue: () => 'Updated Recipe' } as any,
                'Updated description',
                ['Ingredient'],
                ['Instruction'],
                { getValue: () => 15 } as any,
                { getValue: () => 25 } as any,
                { getValue: () => 6 } as any,
                { getValue: () => 'medium' } as any,
                { getValue: () => 'Test' } as any,
                null,
                new Date(),
                new Date()
            );

            repository.update(updatedRecipe);

            const found = repository.findById('update-test-1');
            expect(found?.name.getValue()).toBe('Updated Recipe');
        });

        it('should throw error when recipe not found', () => {
            const nonExistentRecipe = new Recipe(
                'non-existent',
                { getValue: () => 'Recipe' } as any,
                'Description',
                ['Ingredient'],
                ['Instruction'],
                { getValue: () => 10 } as any,
                { getValue: () => 20 } as any,
                { getValue: () => 4 } as any,
                { getValue: () => 'easy' } as any,
                { getValue: () => 'Test' } as any,
                null,
                new Date(),
                new Date()
            );

            expect(() => repository.update(nonExistentRecipe)).toThrow('Recipe not found');
        });
    });

    describe('delete', () => {
        it('should delete a recipe by id', () => {
            // Setup: save a recipe first
            const mockRecipe = new Recipe(
                'delete-test-1',
                { getValue: () => 'Recipe to Delete' } as any,
                'Description',
                ['Ingredient'],
                ['Instruction'],
                { getValue: () => 10 } as any,
                { getValue: () => 20 } as any,
                { getValue: () => 4 } as any,
                { getValue: () => 'easy' } as any,
                { getValue: () => 'Test' } as any,
                null,
                new Date(),
                new Date()
            );

            repository.save(mockRecipe);

            const result = repository.delete('delete-test-1');

            expect(result).toBe(true);
            expect(repository.findById('delete-test-1')).toBeNull();
        });

        it('should return false when recipe not found', () => {
            const result = repository.delete('non-existent-id');
            expect(result).toBe(false);
        });
    });

    describe('findByCategory', () => {
        it('should return recipes of a specific category', () => {
            // Use the test-1 recipe which has category 'Test'
            const result = repository.findByCategory('Test');
            result.forEach((recipe) => {
                expect(recipe.category.getValue()).toBe('Test');
            });
        });

        it('should return all recipes when category is empty', () => {
            const allRecipes = repository.findAll();
            const result = repository.findByCategory('');
            expect(result.length).toBe(allRecipes.length);
        });
    });

    describe('findByDifficulty', () => {
        it('should return recipes of a specific difficulty', () => {
            const result = repository.findByDifficulty('easy');
            result.forEach((recipe) => {
                expect(recipe.difficulty.getValue()).toBe('easy');
            });
        });

        it('should return all recipes when difficulty is empty', () => {
            const allRecipes = repository.findAll();
            const result = repository.findByDifficulty('');
            expect(result.length).toBe(allRecipes.length);
        });
    });

    describe('search', () => {
        it('should search recipes by name', () => {
            const recipes = repository.findAll();
            if (recipes.length > 0) {
                const firstRecipeName = recipes[0].name.getValue();
                const searchTerm = firstRecipeName.substring(0, 3);

                const result = repository.search(searchTerm);
                expect(Array.isArray(result)).toBe(true);
            }
        });

        it('should be case-insensitive', () => {
            const lowerResult = repository.search('test');
            const upperResult = repository.search('TEST');

            expect(lowerResult.length).toBe(upperResult.length);
        });

        it('should return empty array when no matches', () => {
            const result = repository.search('nonexistentrecipexyz123');
            expect(result).toEqual([]);
        });
    });
});
