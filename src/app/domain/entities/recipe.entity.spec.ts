import { describe, it, expect, beforeEach } from 'vitest';
import { Recipe, RecipeCreationData, RecipeUpdateData, RecipeMapper, RecipeDto } from './recipe.entity';

describe('Recipe Entity', () => {
    let mockRecipeData: RecipeCreationData;

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

    describe('create', () => {
        it('should create a new recipe with generated id and timestamps', () => {
            const recipe = Recipe.create(mockRecipeData);

            expect(recipe.id).toBeDefined();
            expect(recipe.id).not.toBe('');
            expect(recipe.name).toBe(mockRecipeData.name);
            expect(recipe.description).toBe(mockRecipeData.description);
            expect(recipe.ingredients).toEqual(mockRecipeData.ingredients);
            expect(recipe.instructions).toEqual(mockRecipeData.instructions);
            expect(recipe.prepTime).toBe(mockRecipeData.prepTime);
            expect(recipe.cookTime).toBe(mockRecipeData.cookTime);
            expect(recipe.servings).toBe(mockRecipeData.servings);
            expect(recipe.difficulty).toBe(mockRecipeData.difficulty);
            expect(recipe.category).toBe(mockRecipeData.category);
            expect(recipe.imageUrl).toBe(mockRecipeData.imageUrl);
            expect(recipe.createdAt).toBeInstanceOf(Date);
            expect(recipe.updatedAt).toBeInstanceOf(Date);
            expect(recipe.createdAt.getTime()).toBe(recipe.updatedAt.getTime());
        });

        it('should create recipe without imageUrl', () => {
            const dataWithoutImage = { ...mockRecipeData };
            delete dataWithoutImage.imageUrl;

            const recipe = Recipe.create(dataWithoutImage);

            expect(recipe.imageUrl).toBeNull();
        });

        it('should create recipe with empty imageUrl', () => {
            const dataWithEmptyImage = { ...mockRecipeData, imageUrl: '' };

            const recipe = Recipe.create(dataWithEmptyImage);

            expect(recipe.imageUrl).toBeNull();
        });

        it('should handle all difficulty levels', () => {
            const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

            difficulties.forEach((difficulty) => {
                const data = { ...mockRecipeData, difficulty };
                const recipe = Recipe.create(data);
                expect(recipe.difficulty).toBe(difficulty);
            });
        });
    });

    describe('update', () => {
        let existingRecipe: Recipe;
        let updateData: RecipeUpdateData;

        beforeEach(() => {
            existingRecipe = Recipe.create(mockRecipeData);
            updateData = {
                name: 'Updated Recipe Name',
                prepTime: 15,
                cookTime: 25
            };
        });

        it('should update specified fields and keep others unchanged', () => {
            const updatedRecipe = existingRecipe.update(updateData);

            expect(updatedRecipe.id).toBe(existingRecipe.id);
            expect(updatedRecipe.name).toBe(updateData.name);
            expect(updatedRecipe.prepTime).toBe(updateData.prepTime);
            expect(updatedRecipe.cookTime).toBe(updateData.cookTime);
            expect(updatedRecipe.description).toBe(existingRecipe.description);
            expect(updatedRecipe.ingredients).toBe(existingRecipe.ingredients);
            expect(updatedRecipe.category).toBe(existingRecipe.category);
            expect(updatedRecipe.createdAt).toBe(existingRecipe.createdAt);
        });

        it('should update updatedAt timestamp', () => {
            const updatedRecipe = existingRecipe.update(updateData);

            expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThanOrEqual(
                existingRecipe.updatedAt.getTime()
            );
        });

        it('should keep createdAt unchanged', () => {
            const updatedRecipe = existingRecipe.update(updateData);

            expect(updatedRecipe.createdAt).toBe(existingRecipe.createdAt);
        });

        it('should update all fields when all are provided', () => {
            const fullUpdateData: RecipeUpdateData = {
                name: 'New Name',
                description: 'New Description',
                ingredients: ['New Ingredient'],
                instructions: ['New Instruction'],
                prepTime: 5,
                cookTime: 10,
                servings: 2,
                difficulty: 'hard',
                category: 'New Category',
                imageUrl: 'new-image.jpg'
            };

            const updatedRecipe = existingRecipe.update(fullUpdateData);

            expect(updatedRecipe.name).toBe(fullUpdateData.name);
            expect(updatedRecipe.description).toBe(fullUpdateData.description);
            expect(updatedRecipe.ingredients).toEqual(fullUpdateData.ingredients);
            expect(updatedRecipe.instructions).toEqual(fullUpdateData.instructions);
            expect(updatedRecipe.prepTime).toBe(fullUpdateData.prepTime);
            expect(updatedRecipe.cookTime).toBe(fullUpdateData.cookTime);
            expect(updatedRecipe.servings).toBe(fullUpdateData.servings);
            expect(updatedRecipe.difficulty).toBe(fullUpdateData.difficulty);
            expect(updatedRecipe.category).toBe(fullUpdateData.category);
            expect(updatedRecipe.imageUrl).toBe(fullUpdateData.imageUrl);
        });

        it('should handle empty update data', () => {
            const updatedRecipe = existingRecipe.update({});

            expect(updatedRecipe.name).toBe(existingRecipe.name);
            expect(updatedRecipe.description).toBe(existingRecipe.description);
            expect(updatedRecipe.prepTime).toBe(existingRecipe.prepTime);
            expect(updatedRecipe.cookTime).toBe(existingRecipe.cookTime);
        });

        it('should remove imageUrl when explicitly set to null', () => {
            const updatedRecipe = existingRecipe.update({ imageUrl: null });

            expect(updatedRecipe.imageUrl).toBeNull();
        });

        it('should set imageUrl to empty string when provided', () => {
            const updatedRecipe = existingRecipe.update({ imageUrl: '' });

            expect(updatedRecipe.imageUrl).toBe('');
        });

        it('should not modify original recipe (immutability)', () => {
            const originalName = existingRecipe.name;
            const originalPrepTime = existingRecipe.prepTime;

            existingRecipe.update({ name: 'Changed', prepTime: 999 });

            expect(existingRecipe.name).toBe(originalName);
            expect(existingRecipe.prepTime).toBe(originalPrepTime);
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
