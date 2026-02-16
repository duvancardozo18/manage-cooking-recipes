import { RecipeMapper } from './recipe.mapper';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeDto } from '../dtos/recipe.dto';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('RecipeMapper', () => {
    const mockRecipe = new Recipe(
        '1',
        RecipeName.create('Pasta Carbonara'),
        'A classic Italian pasta dish',
        ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
        ['Boil pasta', 'Fry bacon', 'Mix with eggs'],
        CookingTime.create(15),
        CookingTime.create(20),
        Servings.create(4),
        Difficulty.create('medium'),
        Category.create('Pasta'),
        'https://example.com/image.jpg',
        new Date('2024-01-01'),
        new Date('2024-01-02')
    );

    const mockDto: RecipeDto = {
        id: '1',
        name: 'Pasta Carbonara',
        description: 'A classic Italian pasta dish',
        ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
        instructions: ['Boil pasta', 'Fry bacon', 'Mix with eggs'],
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        difficulty: 'medium',
        category: 'Pasta',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
    };

    describe('toDto', () => {
        it('should convert Recipe entity to DTO', () => {
            const dto = RecipeMapper.toDto(mockRecipe);

            expect(dto.id).toBe(mockRecipe.id);
            expect(dto.name).toBe(mockRecipe.name.getValue());
            expect(dto.description).toBe(mockRecipe.description);
            expect(dto.ingredients).toEqual(mockRecipe.ingredients);
            expect(dto.instructions).toEqual(mockRecipe.instructions);
            expect(dto.prepTime).toBe(mockRecipe.prepTime.getValue());
            expect(dto.cookTime).toBe(mockRecipe.cookTime.getValue());
            expect(dto.servings).toBe(mockRecipe.servings.getValue());
            expect(dto.difficulty).toBe(mockRecipe.difficulty.getValue());
            expect(dto.category).toBe(mockRecipe.category.getValue());
            expect(dto.imageUrl).toBe(mockRecipe.imageUrl);
            expect(dto.createdAt).toBe(mockRecipe.createdAt);
            expect(dto.updatedAt).toBe(mockRecipe.updatedAt);
        });

        it('should handle null imageUrl', () => {
            const recipeWithoutImage = new Recipe(
                '2',
                RecipeName.create('Simple Recipe'),
                'A simple recipe without image',
                ['Ingredient 1'],
                ['Instruction 1'],
                CookingTime.create(10),
                CookingTime.create(20),
                Servings.create(2),
                Difficulty.create('easy'),
                Category.create('Simple'),
                null,
                new Date(),
                new Date()
            );

            const dto = RecipeMapper.toDto(recipeWithoutImage);
            expect(dto.imageUrl).toBeNull();
        });
    });

    describe('toDomain', () => {
        it('should convert DTO to Recipe entity', () => {
            const recipe = RecipeMapper.toDomain(mockDto);

            expect(recipe.id).toBe(mockDto.id);
            expect(recipe.name.getValue()).toBe(mockDto.name);
            expect(recipe.description).toBe(mockDto.description);
            expect(recipe.ingredients).toEqual(mockDto.ingredients);
            expect(recipe.instructions).toEqual(mockDto.instructions);
            expect(recipe.prepTime.getValue()).toBe(mockDto.prepTime);
            expect(recipe.cookTime.getValue()).toBe(mockDto.cookTime);
            expect(recipe.servings.getValue()).toBe(mockDto.servings);
            expect(recipe.difficulty.getValue()).toBe(mockDto.difficulty);
            expect(recipe.category.getValue()).toBe(mockDto.category);
            expect(recipe.imageUrl).toBe(mockDto.imageUrl);
            expect(recipe.createdAt).toBe(mockDto.createdAt);
            expect(recipe.updatedAt).toBe(mockDto.updatedAt);
        });

        it('should create Recipe entity from DTO with null imageUrl', () => {
            const dtoWithoutImage: RecipeDto = {
                ...mockDto,
                imageUrl: null,
            };

            const recipe = RecipeMapper.toDomain(dtoWithoutImage);
            expect(recipe.imageUrl).toBeNull();
        });

        it('should throw error for invalid DTO data', () => {
            const invalidDto: RecipeDto = {
                ...mockDto,
                name: 'ab', // Too short
            };

            expect(() => RecipeMapper.toDomain(invalidDto)).toThrow();
        });
    });

    describe('bidirectional conversion', () => {
        it('should maintain data integrity through dto -> domain -> dto conversion', () => {
            const recipe = RecipeMapper.toDomain(mockDto);
            const dtoAgain = RecipeMapper.toDto(recipe);

            expect(dtoAgain.id).toBe(mockDto.id);
            expect(dtoAgain.name).toBe(mockDto.name);
            expect(dtoAgain.description).toBe(mockDto.description);
            expect(dtoAgain.prepTime).toBe(mockDto.prepTime);
            expect(dtoAgain.cookTime).toBe(mockDto.cookTime);
        });
    });
});
