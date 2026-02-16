import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateRecipeUseCase } from './update-recipe.use-case';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { UpdateRecipeDto } from '../../infrastructure/dtos/recipe.dto';

describe('UpdateRecipeUseCase', () => {
    let useCase: UpdateRecipeUseCase;
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

        useCase = new UpdateRecipeUseCase(mockRepository);

        existingRecipe = new Recipe(
            '123',
            'Existing Recipe',
            'This is an existing recipe description',
            ['Ingredient 1', 'Ingredient 2'],
            ['Step 1', 'Step 2'],
            10,
            20,
            4,
            'medium',
            'Test Category',
            'test.jpg',
            new Date(),
            new Date()
        );
    });

    describe('Successful updates', () => {
        it('should update recipe with valid data', () => {
            const updateData: UpdateRecipeDto = {
                name: 'Updated Recipe Name',
                prepTime: 15
            };

            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);
            const updatedRecipe = new Recipe(
                existingRecipe.id,
                'Updated Recipe Name',
                existingRecipe.description,
                existingRecipe.ingredients,
                existingRecipe.instructions,
                15,
                existingRecipe.cookTime,
                existingRecipe.servings,
                existingRecipe.difficulty,
                existingRecipe.category,
                existingRecipe.imageUrl,
                existingRecipe.createdAt,
                new Date()
            );
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(mockRepository.findById).toHaveBeenCalledWith('123');
            expect(mockRepository.update).toHaveBeenCalledWith(expect.any(Recipe));
            expect(result.name).toBe('Updated Recipe Name');
        });

        it('should update all fields when provided', () => {
            const updateData: UpdateRecipeDto = {
                name: 'New Name',
                description: 'New description with enough characters',
                ingredients: ['New Ingredient'],
                instructions: ['New Instruction'],
                prepTime: 5,
                cookTime: 15,
                servings: 2,
                difficulty: 'hard',
                category: 'New Category',
                imageUrl: 'new-image.jpg'
            };

            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result.name).toBe(updateData.name);
            expect(result.description).toBe(updateData.description);
            expect(result.prepTime).toBe(updateData.prepTime);
            expect(mockRepository.update).toHaveBeenCalled();
        });

        it('should update imageUrl to null', () => {
            const updateData: UpdateRecipeDto = { imageUrl: null };

            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result.imageUrl).toBeNull();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });

    describe('Recipe not found', () => {
        it('should throw error when recipe does not exist', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(null);

            const updateData: UpdateRecipeDto = { name: 'New Name' };

            expect(() => useCase.execute('nonexistent', updateData)).toThrow('Recipe not found');
            expect(mockRepository.findById).toHaveBeenCalledWith('nonexistent');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('Name validation', () => {
        it('should throw error if name is too short', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { name: 'Ab' };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Recipe name must be at least 3 characters'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if name is empty string', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { name: '' };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Recipe name must be at least 3 characters'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if name is only whitespace', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { name: '   ' };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Recipe name must be at least 3 characters'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should accept name with exactly 3 characters', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { name: 'Pie' };
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result).toBeDefined();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });

    describe('Description validation', () => {
        it('should throw error if description is too short', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { description: 'Short' };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Recipe description must be at least 10 characters'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if description is empty', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { description: '' };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Recipe description must be at least 10 characters'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should accept description with exactly 10 characters', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { description: '1234567890' };
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result).toBeDefined();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });

    describe('Time validation', () => {
        it('should throw error if prepTime is 0', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { prepTime: 0 };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Preparation time must be at least 1 minute'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if cookTime is 0', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { cookTime: 0 };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Cooking time must be at least 1 minute'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if prepTime is negative', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { prepTime: -5 };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Preparation time must be at least 1 minute'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should accept valid prepTime and cookTime', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { prepTime: 1, cookTime: 1 };
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result).toBeDefined();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });

    describe('Servings validation', () => {
        it('should throw error if servings is 0', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { servings: 0 };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Servings must be at least 1'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if servings is negative', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { servings: -1 };

            expect(() => useCase.execute('123', updateData)).toThrow(
                'Servings must be at least 1'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should accept servings of 1', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = { servings: 1 };
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result).toBeDefined();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });

    describe('Empty update', () => {
        it('should handle empty update data', () => {
            vi.mocked(mockRepository.findById).mockReturnValue(existingRecipe);

            const updateData: UpdateRecipeDto = {};
            const updatedRecipe = existingRecipe.update(updateData);
            vi.mocked(mockRepository.update).mockReturnValue(updatedRecipe);

            const result = useCase.execute('123', updateData);

            expect(result).toBeDefined();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });
});

