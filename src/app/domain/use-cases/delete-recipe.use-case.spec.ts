import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteRecipeUseCase } from './delete-recipe.use-case';
import { Recipe } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

describe('DeleteRecipeUseCase', () => {
    let useCase: DeleteRecipeUseCase;
    let mockRepository: RecipeRepository;
    let existingRecipe: Recipe;

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

        useCase = new DeleteRecipeUseCase(mockRepository);

        existingRecipe = new Recipe(
            '123',
            'Recipe to Delete',
            'This recipe will be deleted',
            ['Ingredient 1'],
            ['Step 1'],
            10,
            20,
            4,
            'easy',
            'Test Category',
            null,
            new Date(),
            new Date()
        );
    });

    describe('Successful deletion', () => {
        it('should delete existing recipe and return true', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);
            vi.mocked(mockRepository.delete).mockReturnValue(true);

            const result = useCase.execute('123');

            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith('123');
            expect(mockRepository.delete).toHaveBeenCalledWith('123');
        });

        it('should call repository methods in correct order', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);
            vi.mocked(mockRepository.delete).mockReturnValue(true);

            useCase.execute('123');

            const findByIdCall = mockRepository.findById as any;
            const deleteCall = mockRepository.delete as any;

            expect(findByIdCall.mock.invocationCallOrder[0]).toBeLessThan(
                deleteCall.mock.invocationCallOrder[0]
            );
        });
    });

    describe('Recipe not found', () => {
        it('should throw error when recipe does not exist', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(null);

            expect(() => useCase.execute('nonexistent')).toThrow('Recipe not found');
            expect(mockRepository.findById).toHaveBeenCalledWith('nonexistent');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should not call delete when recipe not found', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(null);

            try {
                useCase.execute('nonexistent');
            } catch (error) {
                // Expected error
            }

            expect(mockRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe('Edge cases', () => {
        it('should handle empty string id', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(null);

            expect(() => useCase.execute('')).toThrow('Recipe not found');
            expect(mockRepository.findById).toHaveBeenCalledWith('');
        });

        it('should handle deletion when repository returns false', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);
            vi.mocked(mockRepository.delete).mockReturnValue(false);

            const result = useCase.execute('123');

            expect(result).toBe(false);
            expect(mockRepository.delete).toHaveBeenCalledWith('123');
        });
    });
});
