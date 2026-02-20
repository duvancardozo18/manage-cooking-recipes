import { LocalStorageRecipeRepository } from './local-storage-recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('LocalStorageRecipeRepository', () => {
    let repository: LocalStorageRecipeRepository;
    let localStorageMock: { [key: string]: string };
    let mockEventService: any;

    beforeEach(() => {
        // Mock EventService
        mockEventService = {
            emitRecipeAdded: jest.fn(),
            emitRecipeUpdated: jest.fn(),
            emitRecipeDeleted: jest.fn(),
        };

        // Mock localStorage
        localStorageMock = {};

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

        repository = new LocalStorageRecipeRepository(mockEventService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        it('should initialize with sample data if empty', () => {
            const recipes = repository.findAll();
            expect(recipes.length).toBeGreaterThan(0);
        });

        it('should load existing data from localStorage', () => {
            const existingData = JSON.stringify([
                {
                    id: 'test-1',
                    name: 'Test Recipe',
                    description: 'Test description for the recipe',
                    ingredients: ['Test Ingredient'],
                    instructions: ['Test Instruction'],
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

            localStorageMock['recipes'] = existingData;
            const newRepository = new LocalStorageRecipeRepository(mockEventService);
            const recipes = newRepository.findAll();

            expect(recipes).toHaveLength(1);
            expect(recipes[0].id).toBe('test-1');
        });
    });

    describe('findAll', () => {
        it('should return all recipes', () => {
            const recipes = repository.findAll();
            expect(Array.isArray(recipes)).toBe(true);
            expect(recipes.length).toBeGreaterThan(0);
        });

        it('should return Recipe entities', () => {
            const recipes = repository.findAll();
            expect(recipes[0]).toBeInstanceOf(Recipe);
        });
    });

    describe('findById', () => {
        it('should return a recipe by id', () => {
            const allRecipes = repository.findAll();
            const firstRecipe = allRecipes[0];

            const found = repository.findById(firstRecipe.id);

            expect(found).not.toBeNull();
            expect(found?.id).toBe(firstRecipe.id);
        });

        it('should return null for non-existent id', () => {
            const found = repository.findById('non-existent-id');
            expect(found).toBeNull();
        });
    });

    describe('save', () => {
        it('should save a new recipe', () => {
            const newRecipe = new Recipe(
                'new-id',
                RecipeName.create('New Recipe'),
                'A brand new recipe description',
                ['Ingredient 1'],
                ['Instruction 1'],
                CookingTime.create(15),
                CookingTime.create(30),
                Servings.create(4),
                Difficulty.create('medium'),
                Category.create('Pasta'),
                null,
                new Date(),
                new Date()
            );

            const saved = repository.save(newRecipe);

            expect(saved).toBe(newRecipe);
            expect(repository.findById('new-id')).not.toBeNull();
        });
    });

    describe('update', () => {
        it('should update an existing recipe', () => {
            const allRecipes = repository.findAll();
            const firstRecipe = allRecipes[0];

            const updatedRecipe = new Recipe(
                firstRecipe.id,
                RecipeName.create('Updated Name'),
                'Updated description for the recipe',
                firstRecipe.ingredients,
                firstRecipe.instructions,
                firstRecipe.prepTime,
                firstRecipe.cookTime,
                firstRecipe.servings,
                firstRecipe.difficulty,
                firstRecipe.category,
                firstRecipe.imageUrl,
                firstRecipe.createdAt,
                new Date()
            );

            const result = repository.update(updatedRecipe);

            expect(result.name.getValue()).toBe('Updated Name');
            expect(repository.findById(firstRecipe.id)?.name.getValue()).toBe('Updated Name');
        });

        it('should throw error when recipe not found', () => {
            const nonExistentRecipe = new Recipe(
                'non-existent',
                RecipeName.create('Recipe'),
                'Description',
                ['Ingredient'],
                ['Instruction'],
                CookingTime.create(10),
                CookingTime.create(20),
                Servings.create(4),
                Difficulty.create('easy'),
                Category.create('Test'),
                null,
                new Date(),
                new Date()
            );

            expect(() => repository.update(nonExistentRecipe)).toThrow('Recipe not found');
        });
    });

    describe('delete', () => {
        it('should delete a recipe by id', () => {
            const allRecipes = repository.findAll();
            const firstRecipeId = allRecipes[0].id;

            const result = repository.delete(firstRecipeId);

            expect(result).toBe(true);
            expect(repository.findById(firstRecipeId)).toBeNull();
        });

        it('should return false when recipe not found', () => {
            const result = repository.delete('non-existent-id');
            expect(result).toBe(false);
        });
    });

    describe('findByCategory', () => {
        it('should return recipes of a specific category', () => {
            const allRecipes = repository.findAll();
            const firstCategory = allRecipes[0].category.getValue();

            const result = repository.findByCategory(firstCategory);

            expect(result.length).toBeGreaterThan(0);
            result.forEach((recipe) => {
                expect(recipe.category.getValue()).toBe(firstCategory);
            });
        });

        it('should return all recipes when category is empty', () => {
            const result = repository.findByCategory('');
            expect(result).toEqual(repository.findAll());
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
            const result = repository.findByDifficulty('');
            expect(result).toEqual(repository.findAll());
        });
    });

    describe('search', () => {
        it('should search recipes by name', () => {
            const allRecipes = repository.findAll();
            const firstRecipeName = allRecipes[0].name.getValue();
            const searchTerm = firstRecipeName.substring(0, 5);

            const result = repository.search(searchTerm);

            expect(result.length).toBeGreaterThan(0);
        });

        it('should search recipes by description', () => {
            const result = repository.search('con');

            expect(result.length).toBeGreaterThan(0);
        });

        it('should search recipes by category', () => {
            const allRecipes = repository.findAll();
            const category = allRecipes[0].category.getValue();

            const result = repository.search(category);

            expect(result.length).toBeGreaterThan(0);
        });

        it('should be case-insensitive', () => {
            const allRecipes = repository.findAll();
            const firstRecipeName = allRecipes[0].name.getValue();

            const lowerResult = repository.search(firstRecipeName.toLowerCase());
            const upperResult = repository.search(firstRecipeName.toUpperCase());

            expect(lowerResult.length).toBe(upperResult.length);
        });

        it('should return empty array when no matches', () => {
            const result = repository.search('nonexistentrecipexyz123');
            expect(result).toEqual([]);
        });
    });
});
