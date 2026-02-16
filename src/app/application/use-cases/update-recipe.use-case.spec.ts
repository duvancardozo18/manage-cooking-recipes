import { UpdateRecipeUseCase } from './update-recipe.use-case';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('UpdateRecipeUseCase', () => {
    let useCase: UpdateRecipeUseCase;
    let mockRepository: jest.Mocked<RecipeRepository>;
    let existingRecipe: Recipe;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByCategory: jest.fn(),
            findByDifficulty: jest.fn(),
            search: jest.fn(),
        };

        existingRecipe = new Recipe(
            '1',
            RecipeName.create('Original Recipe'),
            'Original description for testing',
            ['Original Ingredient'],
            ['Original Instruction'],
            CookingTime.create(10),
            CookingTime.create(20),
            Servings.create(4),
            Difficulty.create('easy'),
            Category.create('Pasta'),
            'https://example.com/original.jpg',
            new Date('2024-01-01'),
            new Date('2024-01-01')
        );

        useCase = new UpdateRecipeUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should update recipe with valid data', () => {
            const updateData = {
                name: 'Updated Recipe',
                description: 'Updated description with more details',
            };

            mockRepository.findById.mockReturnValue(existingRecipe);

            const updatedRecipe = new Recipe(
                existingRecipe.id,
                RecipeName.create(updateData.name),
                updateData.description,
                existingRecipe.ingredients,
                existingRecipe.instructions,
                existingRecipe.prepTime,
                existingRecipe.cookTime,
                existingRecipe.servings,
                existingRecipe.difficulty,
                existingRecipe.category,
                existingRecipe.imageUrl,
                existingRecipe.createdAt,
                new Date()
            );

            mockRepository.update.mockReturnValue(updatedRecipe);

            const result = useCase.execute('1', updateData);

            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(mockRepository.update).toHaveBeenCalled();
            expect(result).toBe(updatedRecipe);
        });

        it('should update only specified fields', () => {
            const updateData = {
                servings: 6,
            };

            mockRepository.findById.mockReturnValue(existingRecipe);

            const updatedRecipe = new Recipe(
                existingRecipe.id,
                existingRecipe.name,
                existingRecipe.description,
                existingRecipe.ingredients,
                existingRecipe.instructions,
                existingRecipe.prepTime,
                existingRecipe.cookTime,
                Servings.create(updateData.servings),
                existingRecipe.difficulty,
                existingRecipe.category,
                existingRecipe.imageUrl,
                existingRecipe.createdAt,
                new Date()
            );

            mockRepository.update.mockReturnValue(updatedRecipe);

            const result = useCase.execute('1', updateData);

            expect(result.servings.getValue()).toBe(6);
            expect(result.name).toBe(existingRecipe.name);
        });

        it('should throw error when recipe not found', () => {
            mockRepository.findById.mockReturnValue(null);

            const updateData = { name: 'Updated Recipe' };

            expect(() => useCase.execute('non-existent-id', updateData)).toThrow('Recipe not found');
        });

        it('should throw error for description less than 10 characters', () => {
            mockRepository.findById.mockReturnValue(existingRecipe);

            const updateData = { description: 'Short' };

            expect(() => useCase.execute('1', updateData)).toThrow(
                'Recipe description must be at least 10 characters'
            );
        });

        it('should update all fields at once', () => {
            const updateData = {
                name: 'Completely Updated Recipe',
                description: 'Completely new description with enough characters',
                ingredients: ['New Ingredient 1', 'New Ingredient 2'],
                instructions: ['New Step 1', 'New Step 2'],
                prepTime: 25,
                cookTime: 35,
                servings: 8,
                difficulty: 'hard',
                category: 'Chicken',
                imageUrl: 'https://example.com/new.jpg',
            };

            mockRepository.findById.mockReturnValue(existingRecipe);

            const updatedRecipe = new Recipe(
                existingRecipe.id,
                RecipeName.create(updateData.name),
                updateData.description,
                updateData.ingredients,
                updateData.instructions,
                CookingTime.create(updateData.prepTime),
                CookingTime.create(updateData.cookTime),
                Servings.create(updateData.servings),
                Difficulty.create(updateData.difficulty),
                Category.create(updateData.category),
                updateData.imageUrl,
                existingRecipe.createdAt,
                new Date()
            );

            mockRepository.update.mockReturnValue(updatedRecipe);

            const result = useCase.execute('1', updateData);

            expect(result.name.getValue()).toBe(updateData.name);
            expect(result.description).toBe(updateData.description);
            expect(result.servings.getValue()).toBe(updateData.servings);
        });

        it('should preserve createdAt date', () => {
            const updateData = { name: 'Updated Name' };

            mockRepository.findById.mockReturnValue(existingRecipe);

            const updatedRecipe = new Recipe(
                existingRecipe.id,
                RecipeName.create(updateData.name),
                existingRecipe.description,
                existingRecipe.ingredients,
                existingRecipe.instructions,
                existingRecipe.prepTime,
                existingRecipe.cookTime,
                existingRecipe.servings,
                existingRecipe.difficulty,
                existingRecipe.category,
                existingRecipe.imageUrl,
                existingRecipe.createdAt,
                new Date()
            );

            mockRepository.update.mockReturnValue(updatedRecipe);

            const result = useCase.execute('1', updateData);

            expect(result.createdAt).toBe(existingRecipe.createdAt);
        });
    });
});
