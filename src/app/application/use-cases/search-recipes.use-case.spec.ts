import { SearchRecipesUseCase } from './search-recipes.use-case';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('SearchRecipesUseCase', () => {
    let useCase: SearchRecipesUseCase;
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

        useCase = new SearchRecipesUseCase(mockRepository);
    });

    describe('execute', () => {
        const mockRecipes: Recipe[] = [
            new Recipe(
                '1',
                RecipeName.create('Pasta Carbonara'),
                'Italian pasta dish',
                ['Pasta', 'Eggs'],
                ['Boil', 'Mix'],
                CookingTime.create(10),
                CookingTime.create(20),
                Servings.create(4),
                Difficulty.create('medium'),
                Category.create('Pasta'),
                null,
                new Date(),
                new Date()
            ),
            new Recipe(
                '2',
                RecipeName.create('Pasta Bolognese'),
                'Italian pasta with meat sauce',
                ['Pasta', 'Beef'],
                ['Cook', 'Serve'],
                CookingTime.create(15),
                CookingTime.create(30),
                Servings.create(4),
                Difficulty.create('easy'),
                Category.create('Pasta'),
                null,
                new Date(),
                new Date()
            ),
        ];

        it('should search recipes with valid query', () => {
            const query = 'pasta';
            mockRepository.search.mockReturnValue(mockRecipes);

            const result = useCase.execute(query);

            expect(mockRepository.search).toHaveBeenCalledWith(query);
            expect(mockRepository.search).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockRecipes);
            expect(result).toHaveLength(2);
        });

        it('should return all recipes when query is empty', () => {
            const allRecipes = [...mockRecipes];
            mockRepository.findAll.mockReturnValue(allRecipes);

            const result = useCase.execute('');

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(mockRepository.search).not.toHaveBeenCalled();
            expect(result).toEqual(allRecipes);
        });

        it('should return all recipes when query is whitespace', () => {
            const allRecipes = [...mockRecipes];
            mockRepository.findAll.mockReturnValue(allRecipes);

            const result = useCase.execute('   ');

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(mockRepository.search).not.toHaveBeenCalled();
            expect(result).toEqual(allRecipes);
        });

        it('should return empty array when no recipes match', () => {
            const query = 'nonexistent';
            mockRepository.search.mockReturnValue([]);

            const result = useCase.execute(query);

            expect(mockRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle undefined query by returning all recipes', () => {
            const allRecipes = [...mockRecipes];
            mockRepository.findAll.mockReturnValue(allRecipes);

            const result = useCase.execute(undefined as any);

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(allRecipes);
        });
    });
});
