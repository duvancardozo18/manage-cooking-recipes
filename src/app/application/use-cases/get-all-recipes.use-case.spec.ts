import { GetAllRecipesUseCase } from './get-all-recipes.use-case';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('GetAllRecipesUseCase', () => {
    let useCase: GetAllRecipesUseCase;
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

        useCase = new GetAllRecipesUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should return all recipes from repository', () => {
            const mockRecipes: Recipe[] = [
                new Recipe(
                    '1',
                    RecipeName.create('Recipe 1'),
                    'Description 1',
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
                ),
                new Recipe(
                    '2',
                    RecipeName.create('Recipe 2'),
                    'Description 2',
                    ['Ingredient 2'],
                    ['Instruction 2'],
                    CookingTime.create(15),
                    CookingTime.create(30),
                    Servings.create(2),
                    Difficulty.create('medium'),
                    Category.create('Chicken'),
                    null,
                    new Date(),
                    new Date()
                ),
            ];

            mockRepository.findAll.mockReturnValue(mockRecipes);

            const result = useCase.execute();

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockRecipes);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no recipes exist', () => {
            mockRepository.findAll.mockReturnValue([]);

            const result = useCase.execute();

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });
});
