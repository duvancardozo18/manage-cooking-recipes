import { GetRecipeByIdUseCase } from './get-recipe-by-id.use-case';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('GetRecipeByIdUseCase', () => {
    let useCase: GetRecipeByIdUseCase;
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

        useCase = new GetRecipeByIdUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should return a recipe when found', () => {
            const mockRecipe = new Recipe(
                '1',
                RecipeName.create('Pasta Carbonara'),
                'A classic Italian pasta dish',
                ['Pasta', 'Eggs', 'Bacon'],
                ['Boil pasta', 'Fry bacon', 'Mix'],
                CookingTime.create(15),
                CookingTime.create(20),
                Servings.create(4),
                Difficulty.create('medium'),
                Category.create('Pasta'),
                null,
                new Date(),
                new Date()
            );

            mockRepository.findById.mockReturnValue(mockRecipe);

            const result = useCase.execute('1');

            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(mockRepository.findById).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockRecipe);
        });

        it('should return null when recipe is not found', () => {
            mockRepository.findById.mockReturnValue(null);

            const result = useCase.execute('non-existent-id');

            expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
            expect(result).toBeNull();
        });
    });
});
