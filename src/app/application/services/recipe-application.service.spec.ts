import { TestBed } from '@angular/core/testing';
import { RecipeApplicationService } from './recipe-application.service';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';
import { RECIPE_REPOSITORY } from '../../core/providers/repository.providers';

describe('RecipeApplicationService', () => {
    let service: RecipeApplicationService;
    let mockRepository: jest.Mocked<RecipeRepository>;

    const mockRecipe1 = new Recipe(
        '1',
        RecipeName.create('Pasta Carbonara'),
        'A classic Italian pasta dish with eggs and bacon',
        ['Pasta', 'Eggs', 'Bacon'],
        ['Boil pasta', 'Fry bacon'],
        CookingTime.create(15),
        CookingTime.create(20),
        Servings.create(4),
        Difficulty.create('medium'),
        Category.create('Pasta'),
        null,
        new Date(),
        new Date()
    );

    const mockRecipe2 = new Recipe(
        '2',
        RecipeName.create('Chicken Curry'),
        'A delicious Indian chicken curry with spices',
        ['Chicken', 'Curry', 'Spices'],
        ['Cook chicken', 'Add spices'],
        CookingTime.create(20),
        CookingTime.create(30),
        Servings.create(6),
        Difficulty.create('easy'),
        Category.create('Chicken'),
        null,
        new Date(),
        new Date()
    );

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findAll: jest.fn().mockReturnValue([mockRecipe1, mockRecipe2]),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByCategory: jest.fn(),
            findByDifficulty: jest.fn(),
            search: jest.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                RecipeApplicationService,
                { provide: RECIPE_REPOSITORY, useValue: mockRepository },
            ],
        });

        service = TestBed.inject(RecipeApplicationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getRecipes', () => {
        it('should return recipes signal', () => {
            const recipes = service.getRecipes();
            expect(recipes()).toHaveLength(2);
            expect(recipes()[0]).toBe(mockRecipe1);
            expect(recipes()[1]).toBe(mockRecipe2);
        });
    });

    describe('getRecipeById', () => {
        it('should return a recipe when found', () => {
            mockRepository.findById.mockReturnValue(mockRecipe1);

            const result = service.getRecipeById('1');

            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toBe(mockRecipe1);
        });

        it('should return null when recipe not found', () => {
            mockRepository.findById.mockReturnValue(null);

            const result = service.getRecipeById('999');

            expect(result).toBeNull();
        });

        it('should handle errors and return null', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockRepository.findById.mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = service.getRecipeById('1');

            expect(result).toBeNull();
        });
    });

    describe('createRecipe', () => {
        const createData = {
            name: 'New Recipe',
            description: 'A new delicious recipe with great taste',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: ['Step 1', 'Step 2'],
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            difficulty: 'easy',
            category: 'Dessert',
            imageUrl: null,
        };

        it('should create a recipe successfully', () => {
            const newRecipe = new Recipe(
                '3',
                RecipeName.create(createData.name),
                createData.description,
                createData.ingredients,
                createData.instructions,
                CookingTime.create(createData.prepTime),
                CookingTime.create(createData.cookTime),
                Servings.create(createData.servings),
                Difficulty.create(createData.difficulty),
                Category.create(createData.category),
                null,
                new Date(),
                new Date()
            );

            mockRepository.save.mockReturnValue(newRecipe);
            mockRepository.findAll.mockReturnValue([mockRecipe1, mockRecipe2, newRecipe]);

            const result = service.createRecipe(createData);

            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toBe(newRecipe);
        });

        it('should emit recipeAdded$ event when recipe is created', (done) => {
            const newRecipe = new Recipe(
                '3',
                RecipeName.create(createData.name),
                createData.description,
                createData.ingredients,
                createData.instructions,
                CookingTime.create(createData.prepTime),
                CookingTime.create(createData.cookTime),
                Servings.create(createData.servings),
                Difficulty.create(createData.difficulty),
                Category.create(createData.category),
                null,
                new Date(),
                new Date()
            );

            mockRepository.save.mockReturnValue(newRecipe);

            service.recipeAdded$.subscribe((recipe) => {
                expect(recipe).toBe(newRecipe);
                done();
            });

            service.createRecipe(createData);
        });

        it('should throw error for invalid data', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            const invalidData = { ...createData, description: 'short' };

            expect(() => service.createRecipe(invalidData)).toThrow();
        });
    });

    describe('updateRecipe', () => {
        const updateData = {
            name: 'Updated Recipe',
            description: 'Updated description with more details',
        };

        it('should update a recipe successfully', () => {
            const updatedRecipe = new Recipe(
                '1',
                RecipeName.create(updateData.name),
                updateData.description,
                mockRecipe1.ingredients,
                mockRecipe1.instructions,
                mockRecipe1.prepTime,
                mockRecipe1.cookTime,
                mockRecipe1.servings,
                mockRecipe1.difficulty,
                mockRecipe1.category,
                mockRecipe1.imageUrl,
                mockRecipe1.createdAt,
                new Date()
            );

            mockRepository.findById.mockReturnValue(mockRecipe1);
            mockRepository.update.mockReturnValue(updatedRecipe);

            const result = service.updateRecipe('1', updateData);

            expect(mockRepository.update).toHaveBeenCalled();
            expect(result).toBe(updatedRecipe);
        });

        it('should emit recipeUpdated$ event when recipe is updated', (done) => {
            const updatedRecipe = new Recipe(
                '1',
                RecipeName.create(updateData.name),
                updateData.description,
                mockRecipe1.ingredients,
                mockRecipe1.instructions,
                mockRecipe1.prepTime,
                mockRecipe1.cookTime,
                mockRecipe1.servings,
                mockRecipe1.difficulty,
                mockRecipe1.category,
                mockRecipe1.imageUrl,
                mockRecipe1.createdAt,
                new Date()
            );

            mockRepository.findById.mockReturnValue(mockRecipe1);
            mockRepository.update.mockReturnValue(updatedRecipe);

            service.recipeUpdated$.subscribe((recipe) => {
                expect(recipe).toBe(updatedRecipe);
                done();
            });

            service.updateRecipe('1', updateData);
        });

        it('should throw error when recipe not found', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockRepository.findById.mockReturnValue(null);

            expect(() => service.updateRecipe('999', updateData)).toThrow('Recipe not found');
        });
    });

    describe('deleteRecipe', () => {
        it('should delete a recipe successfully', () => {
            mockRepository.findById.mockReturnValue(mockRecipe1);
            mockRepository.delete.mockReturnValue(true);

            const result = service.deleteRecipe('1');

            expect(mockRepository.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });

        it('should emit recipeDeleted$ event when recipe is deleted', (done) => {
            mockRepository.findById.mockReturnValue(mockRecipe1);
            mockRepository.delete.mockReturnValue(true);

            service.recipeDeleted$.subscribe((id) => {
                expect(id).toBe('1');
                done();
            });

            service.deleteRecipe('1');
        });

        it('should return false when deletion fails', () => {
            mockRepository.findById.mockReturnValue(mockRecipe1);
            mockRepository.delete.mockReturnValue(false);

            const result = service.deleteRecipe('1');

            expect(result).toBe(false);
        });

        it('should handle errors and return false', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockRepository.findById.mockImplementation(() => {
                throw new Error('Recipe not found');
            });

            const result = service.deleteRecipe('999');

            expect(result).toBe(false);
        });
    });

    describe('searchRecipes', () => {
        it('should search recipes successfully', () => {
            const searchResults = [mockRecipe1];
            mockRepository.search.mockReturnValue(searchResults);

            const result = service.searchRecipes('pasta');

            expect(mockRepository.search).toHaveBeenCalledWith('pasta');
            expect(result).toEqual(searchResults);
        });

        it('should return empty array on error', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockRepository.search.mockImplementation(() => {
                throw new Error('Search error');
            });

            const result = service.searchRecipes('pasta');

            expect(result).toEqual([]);
        });
    });

    describe('filterByCategory', () => {
        it('should filter recipes by category', () => {
            const pastaRecipes = [mockRecipe1];
            mockRepository.findByCategory.mockReturnValue(pastaRecipes);

            const result = service.filterByCategory('Pasta');

            expect(mockRepository.findByCategory).toHaveBeenCalledWith('Pasta');
            expect(result).toEqual(pastaRecipes);
        });

        it('should return empty array on error', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockRepository.findByCategory.mockImplementation(() => {
                throw new Error('Filter error');
            });

            const result = service.filterByCategory('Pasta');

            expect(result).toEqual([]);
        });
    });

    describe('filterByDifficulty', () => {
        it('should filter recipes by difficulty', () => {
            const easyRecipes = [mockRecipe2];
            mockRepository.findByDifficulty.mockReturnValue(easyRecipes);

            const result = service.filterByDifficulty('easy');

            expect(mockRepository.findByDifficulty).toHaveBeenCalledWith('easy');
            expect(result).toEqual(easyRecipes);
        });

        it('should return empty array on error', () => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockRepository.findByDifficulty.mockImplementation(() => {
                throw new Error('Filter error');
            });

            const result = service.filterByDifficulty('easy');

            expect(result).toEqual([]);
        });
    });

    describe('getCategories', () => {
        it('should return unique sorted categories', () => {
            const result = service.getCategories();

            expect(result).toEqual(['Chicken', 'Pasta']);
        });

        it('should return empty array when no recipes', () => {
            mockRepository.findAll.mockReturnValue([]);
            const newService = new RecipeApplicationService(mockRepository);

            const result = newService.getCategories();

            expect(result).toEqual([]);
        });
    });
});
