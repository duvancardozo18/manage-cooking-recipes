import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetAllRecipesUseCase } from './get-all-recipes.use-case';
import { GetRecipeByIdUseCase } from './get-recipe-by-id.use-case';
import { SearchRecipesUseCase } from './search-recipes.use-case';
import { Recipe } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

describe('GetAllRecipesUseCase', () => {
    let useCase: GetAllRecipesUseCase;
    let mockRepository: RecipeRepository;
    let mockRecipes: Recipe[];

    beforeEach(() => {
        mockRepository = {
            save: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            search: vi.fn(),
            findByCategory: vi.fn(),
            findByDifficulty: vi.fn()
        };

        useCase = new GetAllRecipesUseCase(mockRepository);

        mockRecipes = [
            new Recipe(
                '1',
                'Recipe 1',
                'Description 1',
                ['Ing1'],
                ['Step1'],
                10,
                20,
                4,
                'easy',
                'Cat1',
                null,
                new Date(),
                new Date()
            ),
            new Recipe(
                '2',
                'Recipe 2',
                'Description 2',
                ['Ing2'],
                ['Step2'],
                15,
                25,
                2,
                'medium',
                'Cat2',
                null,
                new Date(),
                new Date()
            )
        ];
    });

    it('should return all recipes from repository', () => {
        vi.mocked(mockRepository.findAll).mockReturnValue(mockRecipes);

        const result = useCase.execute();

        expect(result).toEqual(mockRecipes);
        expect(result.length).toBe(2);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no recipes exist', () => {
        vi.mocked(mockRepository.findAll).mockReturnValue([]);

        const result = useCase.execute();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return large number of recipes', () => {
        const manyRecipes = Array.from({ length: 100 }, (_, i) =>
            new Recipe(
                `${i}`,
                `Recipe ${i}`,
                `Description ${i}`,
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
            )
        );
        vi.mocked(mockRepository.findAll).mockReturnValue(manyRecipes);

        const result = useCase.execute();

        expect(result.length).toBe(100);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
});

describe('GetRecipeByIdUseCase', () => {
    let useCase: GetRecipeByIdUseCase;
    let mockRepository: RecipeRepository;
    let mockRecipe: Recipe;

    beforeEach(() => {
        mockRepository = {
            save: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            search: vi.fn(),
            findByCategory: vi.fn(),
            findByDifficulty: vi.fn()
        };

        useCase = new GetRecipeByIdUseCase(mockRepository);

        mockRecipe = new Recipe(
            '123',
            'Test Recipe',
            'Test Description',
            ['Ingredient'],
            ['Instruction'],
            10,
            20,
            4,
            'medium',
            'Category',
            'image.jpg',
            new Date(),
            new Date()
        );
    });

    it('should return recipe when found', () => {
        vi.mocked(mockRepository.findById).mockReturnValue(mockRecipe);

        const result = useCase.execute('123');

        expect(result).toEqual(mockRecipe);
        expect(result?.id).toBe('123');
        expect(mockRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should return null when recipe not found', () => {
        vi.mocked(mockRepository.findById).mockReturnValue(null);

        const result = useCase.execute('nonexistent');

        expect(result).toBeNull();
        expect(mockRepository.findById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle empty string id', () => {
        vi.mocked(mockRepository.findById).mockReturnValue(null);

        const result = useCase.execute('');

        expect(result).toBeNull();
        expect(mockRepository.findById).toHaveBeenCalledWith('');
    });

    it('should call repository with exact id provided', () => {
        vi.mocked(mockRepository.findById).mockReturnValue(mockRecipe);

        useCase.execute('abc-def-123');

        expect(mockRepository.findById).toHaveBeenCalledWith('abc-def-123');
    });
});

describe('SearchRecipesUseCase', () => {
    let useCase: SearchRecipesUseCase;
    let mockRepository: RecipeRepository;
    let mockRecipes: Recipe[];

    beforeEach(() => {
        mockRepository = {
            save: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            search: vi.fn(),
            findByCategory: vi.fn(),
            findByDifficulty: vi.fn()
        };

        useCase = new SearchRecipesUseCase(mockRepository);

        mockRecipes = [
            new Recipe(
                '1',
                'Pasta Carbonara',
                'Italian pasta',
                ['Pasta'],
                ['Cook'],
                10,
                20,
                4,
                'easy',
                'Italian',
                null,
                new Date(),
                new Date()
            ),
            new Recipe(
                '2',
                'Pasta Bolognese',
                'Italian pasta with meat',
                ['Pasta'],
                ['Cook'],
                15,
                30,
                4,
                'medium',
                'Italian',
                null,
                new Date(),
                new Date()
            )
        ];
    });

    describe('Search with query', () => {
        it('should return matching recipes when query is provided', () => {
            vi.mocked(mockRepository.search).mockReturnValue(mockRecipes);

            const result = useCase.execute('pasta');

            expect(result).toEqual(mockRecipes);
            expect(mockRepository.search).toHaveBeenCalledWith('pasta');
            expect(mockRepository.findAll).not.toHaveBeenCalled();
        });

        it('should return empty array when no matches found', () => {
            vi.mocked(mockRepository.search).mockReturnValue([]);

            const result = useCase.execute('nonexistent');

            expect(result).toEqual([]);
            expect(mockRepository.search).toHaveBeenCalledWith('nonexistent');
        });

        it('should handle special characters in query', () => {
            vi.mocked(mockRepository.search).mockReturnValue([]);

            useCase.execute('pasta & sauce');

            expect(mockRepository.search).toHaveBeenCalledWith('pasta & sauce');
        });
    });

    describe('Search without query', () => {
        it('should return all recipes when query is empty string', () => {
            const allRecipes = [...mockRecipes];
            vi.mocked(mockRepository.findAll).mockReturnValue(allRecipes);

            const result = useCase.execute('');

            expect(result).toEqual(allRecipes);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(mockRepository.search).not.toHaveBeenCalled();
        });

        it('should return all recipes when query is only whitespace', () => {
            const allRecipes = [...mockRecipes];
            vi.mocked(mockRepository.findAll).mockReturnValue(allRecipes);

            const result = useCase.execute('   ');

            expect(result).toEqual(allRecipes);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(mockRepository.search).not.toHaveBeenCalled();
        });

        it('should trim query before checking if empty', () => {
            const allRecipes = [...mockRecipes];
            vi.mocked(mockRepository.findAll).mockReturnValue(allRecipes);

            useCase.execute('  \n\t  ');

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(mockRepository.search).not.toHaveBeenCalled();
        });
    });

    describe('Edge cases', () => {
        it('should handle very long search query', () => {
            const longQuery = 'a'.repeat(1000);
            vi.mocked(mockRepository.search).mockReturnValue([]);

            useCase.execute(longQuery);

            expect(mockRepository.search).toHaveBeenCalledWith(longQuery);
        });

        it('should handle unicode characters', () => {
            vi.mocked(mockRepository.search).mockReturnValue([]);

            useCase.execute('café ñoño 中文');

            expect(mockRepository.search).toHaveBeenCalledWith('café ñoño 中文');
        });
    });
});
