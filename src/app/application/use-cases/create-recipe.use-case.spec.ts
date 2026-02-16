import { CreateRecipeUseCase } from './create-recipe.use-case';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('CreateRecipeUseCase', () => {
    let useCase: CreateRecipeUseCase;
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

        useCase = new CreateRecipeUseCase(mockRepository);
    });

    describe('execute', () => {
        const validInput = {
            name: 'Pasta Carbonara',
            description: 'A classic Italian pasta dish with eggs and bacon',
            ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
            instructions: ['Boil pasta', 'Fry bacon', 'Mix everything'],
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            difficulty: 'medium',
            category: 'Pasta',
            imageUrl: 'https://example.com/image.jpg',
        };

        it('should create a recipe with valid data', () => {
            const mockRecipe = new Recipe(
                '1',
                RecipeName.create(validInput.name),
                validInput.description,
                validInput.ingredients,
                validInput.instructions,
                CookingTime.create(validInput.prepTime),
                CookingTime.create(validInput.cookTime),
                Servings.create(validInput.servings),
                Difficulty.create(validInput.difficulty),
                Category.create(validInput.category),
                validInput.imageUrl,
                new Date(),
                new Date()
            );

            mockRepository.save.mockReturnValue(mockRecipe);

            const result = useCase.execute(validInput);

            expect(mockRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockRecipe);
        });

        it('should create a recipe without imageUrl', () => {
            const inputWithoutImage = { ...validInput, imageUrl: undefined };
            const mockRecipe = new Recipe(
                '1',
                RecipeName.create(validInput.name),
                validInput.description,
                validInput.ingredients,
                validInput.instructions,
                CookingTime.create(validInput.prepTime),
                CookingTime.create(validInput.cookTime),
                Servings.create(validInput.servings),
                Difficulty.create(validInput.difficulty),
                Category.create(validInput.category),
                null,
                new Date(),
                new Date()
            );

            mockRepository.save.mockReturnValue(mockRecipe);

            const result = useCase.execute(inputWithoutImage);

            expect(mockRepository.save).toHaveBeenCalled();
            expect(result.imageUrl).toBeNull();
        });

        it('should throw error for description less than 10 characters', () => {
            const invalidInput = { ...validInput, description: 'Short' };

            expect(() => useCase.execute(invalidInput)).toThrow(
                'Recipe description must be at least 10 characters'
            );
        });

        it('should throw error for empty description', () => {
            const invalidInput = { ...validInput, description: '' };

            expect(() => useCase.execute(invalidInput)).toThrow(
                'Recipe description must be at least 10 characters'
            );
        });

        it('should throw error for no ingredients', () => {
            const invalidInput = { ...validInput, ingredients: [] };

            expect(() => useCase.execute(invalidInput)).toThrow(
                'Recipe must have at least one ingredient'
            );
        });

        it('should throw error for no instructions', () => {
            const invalidInput = { ...validInput, instructions: [] };

            expect(() => useCase.execute(invalidInput)).toThrow(
                'Recipe must have at least one instruction'
            );
        });

        it('should validate recipe name through RecipeName value object', () => {
            const invalidInput = { ...validInput, name: 'AB' };

            expect(() => useCase.execute(invalidInput)).toThrow(
                'Recipe name must be at least 3 characters long'
            );
        });

        it('should validate cooking time through CookingTime value object', () => {
            const invalidInput = { ...validInput, prepTime: -1 };

            expect(() => useCase.execute(invalidInput)).toThrow(
                'Cooking time cannot be negative'
            );
        });

        it('should validate servings through Servings value object', () => {
            const invalidInput = { ...validInput, servings: 0 };

            expect(() => useCase.execute(invalidInput)).toThrow('Servings must be at least 1');
        });

        it('should validate difficulty through Difficulty value object', () => {
            const invalidInput = { ...validInput, difficulty: 'invalid' };

            expect(() => useCase.execute(invalidInput)).toThrow('Invalid difficulty level');
        });
    });
});
