import { DeleteRecipeUseCase } from './delete-recipe.use-case';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('DeleteRecipeUseCase', () => {
    let useCase: DeleteRecipeUseCase;
    let mockRepository: jest.Mocked<RecipeRepository>;

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

        useCase = new DeleteRecipeUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should delete a recipe successfully', () => {
            const mockRecipe = new Recipe(
                '1',
                RecipeName.create('Recipe to Delete'),
                'Description of recipe to delete',
                ['Ingredient 1'],
                ['Instruction 1'],
                CookingTime.create(10),
                CookingTime.create(20),
                Servings.create(4),
                Difficulty.create('easy'),
                Category.create('Pasta'),
                null,
                new Date(),
                new Date()
            );

            mockRepository.findById.mockReturnValue(mockRecipe);
            mockRepository.delete.mockReturnValue(true);

            const result = useCase.execute('1');

            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });

        it('should throw error when recipe not found', () => {
            mockRepository.findById.mockReturnValue(null);

            expect(() => useCase.execute('non-existent-id')).toThrow('Recipe not found');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should return false if deletion fails', () => {
            const mockRecipe = new Recipe(
                '1',
                RecipeName.create('Recipe'),
                'Description',
                ['Ingredient'],
                ['Instruction'],
                CookingTime.create(10),
                CookingTime.create(20),
                Servings.create(4),
                Difficulty.create('easy'),
                Category.create('Pasta'),
                null,
                new Date(),
                new Date()
            );

            mockRepository.findById.mockReturnValue(mockRecipe);
            mockRepository.delete.mockReturnValue(false);

            const result = useCase.execute('1');

            expect(result).toBe(false);
        });
    });
});
