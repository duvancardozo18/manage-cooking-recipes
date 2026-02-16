import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateRecipeUseCase } from './create-recipe.use-case';
import { Recipe, RecipeCreationData } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

describe('CreateRecipeUseCase', () => {
    let useCase: CreateRecipeUseCase;
    let mockRepository: RecipeRepository;
    let validRecipeData: RecipeCreationData;

    beforeEach(() => {
        // Create mock repository
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

        useCase = new CreateRecipeUseCase(mockRepository);

        validRecipeData = {
            name: 'Test Recipe',
            description: 'This is a test recipe description with more than 10 characters',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: ['Step 1', 'Step 2'],
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            difficulty: 'medium',
            category: 'Test Category',
            imageUrl: 'test-image.jpg'
        };
    });

    describe('Successful creation', () => {
        it('should create a recipe with valid data', () => {
            const mockRecipe = Recipe.create(validRecipeData);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(validRecipeData);

            expect(result).toEqual(mockRecipe);
            expect(mockRepository.save).toHaveBeenCalledTimes(1);
            expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Recipe));
        });

        it('should create recipe without imageUrl', () => {
            const dataWithoutImage = { ...validRecipeData };
            delete dataWithoutImage.imageUrl;

            const mockRecipe = Recipe.create(dataWithoutImage);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(dataWithoutImage);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should create recipe with all difficulty levels', () => {
            const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

            difficulties.forEach((difficulty) => {
                const data = { ...validRecipeData, difficulty };
                const mockRecipe = Recipe.create(data);
                vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

                const result = useCase.execute(data);

                expect(result.difficulty).toBe(difficulty);
            });
        });
    });

    describe('Name validation', () => {
        it('should throw error if name is empty', () => {
            const invalidData = { ...validRecipeData, name: '' };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe name must be at least 3 characters'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should throw error if name has only whitespace', () => {
            const invalidData = { ...validRecipeData, name: '   ' };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe name must be at least 3 characters'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should throw error if name is less than 3 characters', () => {
            const invalidData = { ...validRecipeData, name: 'Ab' };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe name must be at least 3 characters'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should accept name with exactly 3 characters', () => {
            const data = { ...validRecipeData, name: 'Pie' };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('Description validation', () => {
        it('should throw error if description is empty', () => {
            const invalidData = { ...validRecipeData, description: '' };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe description must be at least 10 characters'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should throw error if description is less than 10 characters', () => {
            const invalidData = { ...validRecipeData, description: 'Short' };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe description must be at least 10 characters'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should accept description with exactly 10 characters', () => {
            const data = { ...validRecipeData, description: '1234567890' };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('Ingredients validation', () => {
        it('should throw error if ingredients array is empty', () => {
            const invalidData = { ...validRecipeData, ingredients: [] };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe must have at least one ingredient'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should accept single ingredient', () => {
            const data = { ...validRecipeData, ingredients: ['Single Ingredient'] };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should accept multiple ingredients', () => {
            const data = {
                ...validRecipeData,
                ingredients: ['Ing 1', 'Ing 2', 'Ing 3', 'Ing 4']
            };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('Instructions validation', () => {
        it('should throw error if instructions array is empty', () => {
            const invalidData = { ...validRecipeData, instructions: [] };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Recipe must have at least one instruction'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should accept single instruction', () => {
            const data = { ...validRecipeData, instructions: ['Mix everything'] };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('Time validation', () => {
        it('should throw error if prepTime is 0', () => {
            const invalidData = { ...validRecipeData, prepTime: 0 };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Preparation and cooking time must be at least 1 minute'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should throw error if cookTime is 0', () => {
            const invalidData = { ...validRecipeData, cookTime: 0 };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Preparation and cooking time must be at least 1 minute'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should throw error if prepTime is negative', () => {
            const invalidData = { ...validRecipeData, prepTime: -5 };

            expect(() => useCase.execute(invalidData)).toThrow(
                'Preparation and cooking time must be at least 1 minute'
            );
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should accept minimum valid times', () => {
            const data = { ...validRecipeData, prepTime: 1, cookTime: 1 };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('Servings validation', () => {
        it('should throw error if servings is 0', () => {
            const invalidData = { ...validRecipeData, servings: 0 };

            expect(() => useCase.execute(invalidData)).toThrow('Servings must be at least 1');
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should throw error if servings is negative', () => {
            const invalidData = { ...validRecipeData, servings: -2 };

            expect(() => useCase.execute(invalidData)).toThrow('Servings must be at least 1');
            expect(mockRepository.save).not.toHaveBeenCalled();
        });

        it('should accept servings of 1', () => {
            const data = { ...validRecipeData, servings: 1 };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should accept large number of servings', () => {
            const data = { ...validRecipeData, servings: 100 };
            const mockRecipe = Recipe.create(data);
            vi.mocked(mockRepository.save).mockReturnValue(mockRecipe);

            const result = useCase.execute(data);

            expect(result).toBeDefined();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });
});
