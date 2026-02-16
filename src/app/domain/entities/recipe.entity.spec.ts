import { describe, it, expect, beforeEach } from 'vitest';
import { Recipe } from './recipe.entity';
import { RecipeMapper } from '../../infrastructure/mappers/recipe.mapper';
import { RecipeDto, CreateRecipeDto, UpdateRecipeDto } from '../../infrastructure/dtos/recipe.dto';

describe('Recipe Entity', () => {
    let mockRecipeData: CreateRecipeDto;

    beforeEach(() => {
        mockRecipeData = {
            name: 'Pasta Carbonara',
            description: 'Classic Italian pasta dish',
            ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
            instructions: ['Boil pasta', 'Cook bacon', 'Mix eggs', 'Combine all'],
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            difficulty: 'medium' as const,
            category: 'Italian',
            imageUrl: 'https://example.com/pasta.jpg'
        };
    });

    describe('Constructor', () => {
        it('should create a recipe instance with all properties', () => {
            const now = new Date();
            const recipe = new Recipe(
                '1',
                'Test Recipe',
                'Description',
                ['Ingredient 1'],
                ['Step 1'],
                10,
                20,
                4,
                'easy',
                'Test Category',
                'image.jpg',
                now,
                now
            );

            expect(recipe.id).toBe('1');
            expect(recipe.name).toBe('Test Recipe');
            expect(recipe.description).toBe('Description');
            expect(recipe.ingredients).toEqual(['Ingredient 1']);
            expect(recipe.instructions).toEqual(['Step 1']);
            expect(recipe.prepTime).toBe(10);
            expect(recipe.cookTime).toBe(20);
            expect(recipe.servings).toBe(4);
            expect(recipe.difficulty).toBe('easy');
            expect(recipe.category).toBe('Test Category');
            expect(recipe.imageUrl).toBe('image.jpg');
            expect(recipe.createdAt).toEqual(now);
            expect(recipe.updatedAt).toEqual(now);
        });

        it('should accept null imageUrl', () => {
            const now = new Date();
            const recipe = new Recipe(
                '1',
                'Test Recipe',
                'Description',
                ['Ingredient 1'],
                ['Step 1'],
                10,
                20,
                4,
                'easy',
                'Test Category',
                null,
                now,
                now
            );

            expect(recipe.imageUrl).toBeNull();
        });
    });

    describe('getTotalTime', () => {
        it('should calculate total time as prepTime + cookTime', () => {
            const now = new Date();
            const recipe = new Recipe(
                '1',
                'Test Recipe',
                'Description',
                [],
                [],
                15,
                30,
                4,
                'medium',
                'Category',
                null,
                now,
                now
            );

            expect(recipe.getTotalTime()).toBe(45);
        });

        it('should return 0 when both times are 0', () => {
            const now = new Date();
            const recipe = new Recipe(
                '1',
                'Test Recipe',
                'Description',
                [],
                [],
                0,
                0,
                4,
                'easy',
                'Category',
                null,
                now,
                now
            );

            expect(recipe.getTotalTime()).toBe(0);
        });

        it('should work with large time values', () => {
            const now = new Date();
            const recipe = new Recipe(
                '1',
                'Test Recipe',
                'Description',
                [],
                [],
                120,
                180,
                4,
                'hard',
                'Category',
                null,
                now,
                now
            );

            expect(recipe.getTotalTime()).toBe(300);
        });
    });
});

describe('RecipeMapper', () => {
    let recipe: Recipe;

    beforeEach(() => {
        const now = new Date();
        recipe = new Recipe(
            '123',
            'Test Recipe',
            'Test Description',
            ['Ingredient 1', 'Ingredient 2'],
            ['Step 1', 'Step 2'],
            10,
            20,
            4,
            'medium',
            'Test Category',
            'test-image.jpg',
            now,
            now
        );
    });

    describe('toDto', () => {
        it('should convert Recipe to RecipeDto', () => {
            const dto = RecipeMapper.toDto(recipe);

            expect(dto.id).toBe(recipe.id);
            expect(dto.name).toBe(recipe.name);
            expect(dto.description).toBe(recipe.description);
            expect(dto.ingredients).toEqual(recipe.ingredients);
            expect(dto.instructions).toEqual(recipe.instructions);
            expect(dto.prepTime).toBe(recipe.prepTime);
            expect(dto.cookTime).toBe(recipe.cookTime);
            expect(dto.servings).toBe(recipe.servings);
            expect(dto.difficulty).toBe(recipe.difficulty);
            expect(dto.category).toBe(recipe.category);
            expect(dto.imageUrl).toBe(recipe.imageUrl);
            expect(dto.createdAt).toBe(recipe.createdAt);
            expect(dto.updatedAt).toBe(recipe.updatedAt);
        });

        it('should handle recipe with null imageUrl', () => {
            const recipeWithoutImage = new Recipe(
                '123',
                'Test',
                'Test',
                [],
                [],
                10,
                20,
                4,
                'easy',
                'Cat',
                null,
                new Date(),
                new Date()
            );

            const dto = RecipeMapper.toDto(recipeWithoutImage);

            expect(dto.imageUrl).toBeNull();
        });
    });

    describe('toDomain', () => {
        it('should convert RecipeDto to Recipe', () => {
            const dto: RecipeDto = {
                id: '456',
                name: 'DTO Recipe',
                description: 'DTO Description',
                ingredients: ['DTO Ingredient'],
                instructions: ['DTO Step'],
                prepTime: 5,
                cookTime: 15,
                servings: 2,
                difficulty: 'hard',
                category: 'DTO Category',
                imageUrl: 'dto-image.jpg',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02')
            };

            const domainRecipe = RecipeMapper.toDomain(dto);

            expect(domainRecipe.id).toBe(dto.id);
            expect(domainRecipe.name).toBe(dto.name);
            expect(domainRecipe.description).toBe(dto.description);
            expect(domainRecipe.ingredients).toEqual(dto.ingredients);
            expect(domainRecipe.instructions).toEqual(dto.instructions);
            expect(domainRecipe.prepTime).toBe(dto.prepTime);
            expect(domainRecipe.cookTime).toBe(dto.cookTime);
            expect(domainRecipe.servings).toBe(dto.servings);
            expect(domainRecipe.difficulty).toBe(dto.difficulty);
            expect(domainRecipe.category).toBe(dto.category);
            expect(domainRecipe.imageUrl).toBe(dto.imageUrl);
            expect(domainRecipe.createdAt).toBe(dto.createdAt);
            expect(domainRecipe.updatedAt).toBe(dto.updatedAt);
        });

        it('should handle dto with null imageUrl', () => {
            const dto: RecipeDto = {
                id: '456',
                name: 'Test',
                description: 'Test',
                ingredients: [],
                instructions: [],
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'easy',
                category: 'Cat',
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const domainRecipe = RecipeMapper.toDomain(dto);

            expect(domainRecipe.imageUrl).toBeNull();
        });
    });

    describe('Round-trip conversion', () => {
        it('should maintain data integrity through toDto and toDomain', () => {
            const dto = RecipeMapper.toDto(recipe);
            const domainRecipe = RecipeMapper.toDomain(dto);

            expect(domainRecipe.id).toBe(recipe.id);
            expect(domainRecipe.name).toBe(recipe.name);
            expect(domainRecipe.description).toBe(recipe.description);
            expect(domainRecipe.ingredients).toEqual(recipe.ingredients);
            expect(domainRecipe.instructions).toEqual(recipe.instructions);
            expect(domainRecipe.prepTime).toBe(recipe.prepTime);
            expect(domainRecipe.cookTime).toBe(recipe.cookTime);
            expect(domainRecipe.servings).toBe(recipe.servings);
            expect(domainRecipe.difficulty).toBe(recipe.difficulty);
            expect(domainRecipe.category).toBe(recipe.category);
            expect(domainRecipe.imageUrl).toBe(recipe.imageUrl);
            expect(domainRecipe.createdAt).toEqual(recipe.createdAt);
            expect(domainRecipe.updatedAt).toEqual(recipe.updatedAt);
        });
    });
});
