import { describe, it, expect, beforeEach } from 'vitest';
import { RecipeViewModelMapper, RecipeViewModel } from './recipe.view-model';
import { Recipe } from '../../domain/entities/recipe.entity';

describe('RecipeViewModelMapper', () => {
    let mockRecipe: Recipe;

    beforeEach(() => {
        mockRecipe = new Recipe(
            '123',
            'Test Recipe',
            'Test Description',
            ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
            ['Step 1', 'Step 2', 'Step 3'],
            15,
            30,
            4,
            'medium',
            'Test Category',
            'test-image.jpg',
            new Date('2024-01-01'),
            new Date('2024-01-02')
        );
    });

    describe('toViewModel', () => {
        it('should convert Recipe to RecipeViewModel', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe);

            expect(viewModel.id).toBe(mockRecipe.id);
            expect(viewModel.name).toBe(mockRecipe.name);
            expect(viewModel.description).toBe(mockRecipe.description);
            expect(viewModel.ingredients).toEqual(mockRecipe.ingredients);
            expect(viewModel.instructions).toEqual(mockRecipe.instructions);
            expect(viewModel.prepTime).toBe(mockRecipe.prepTime);
            expect(viewModel.cookTime).toBe(mockRecipe.cookTime);
            expect(viewModel.servings).toBe(mockRecipe.servings);
            expect(viewModel.difficulty).toBe(mockRecipe.difficulty);
            expect(viewModel.category).toBe(mockRecipe.category);
            expect(viewModel.imageUrl).toBe(mockRecipe.imageUrl);
            expect(viewModel.createdAt).toBe(mockRecipe.createdAt);
            expect(viewModel.updatedAt).toBe(mockRecipe.updatedAt);
        });

        it('should calculate totalTime correctly', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe);

            expect(viewModel.totalTime).toBe(45); // 15 + 30
            expect(viewModel.totalTime).toBe(mockRecipe.getTotalTime());
        });

        it('should map difficulty to correct color for easy', () => {
            const easyRecipe = new Recipe(
                '1',
                'Easy Recipe',
                'Easy Description',
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
            );

            const viewModel = RecipeViewModelMapper.toViewModel(easyRecipe);

            expect(viewModel.difficultyColor).toBe('#10b981');
        });

        it('should map difficulty to correct color for medium', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe);

            expect(viewModel.difficulty).toBe('medium');
            expect(viewModel.difficultyColor).toBe('#f59e0b');
        });

        it('should map difficulty to correct color for hard', () => {
            const hardRecipe = new Recipe(
                '1',
                'Hard Recipe',
                'Hard Description',
                ['Ing'],
                ['Step'],
                10,
                20,
                4,
                'hard',
                'Cat',
                null,
                new Date(),
                new Date()
            );

            const viewModel = RecipeViewModelMapper.toViewModel(hardRecipe);

            expect(viewModel.difficultyColor).toBe('#ef4444');
        });

        it('should handle recipe with null imageUrl', () => {
            const recipeWithoutImage = new Recipe(
                '1',
                'No Image Recipe',
                'No Image Description',
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
            );

            const viewModel = RecipeViewModelMapper.toViewModel(recipeWithoutImage);

            expect(viewModel.imageUrl).toBeNull();
        });

        it('should handle recipe with empty string imageUrl', () => {
            const recipeWithEmptyImage = new Recipe(
                '1',
                'Empty Image Recipe',
                'Empty Image Description',
                ['Ing'],
                ['Step'],
                10,
                20,
                4,
                'easy',
                'Cat',
                '',
                new Date(),
                new Date()
            );

            const viewModel = RecipeViewModelMapper.toViewModel(recipeWithEmptyImage);

            expect(viewModel.imageUrl).toBe('');
        });

        it('should preserve dates correctly', () => {
            const createdDate = new Date('2024-06-15');
            const updatedDate = new Date('2024-07-20');

            const recipe = new Recipe(
                '1',
                'Date Test Recipe',
                'Date Test Description',
                ['Ing'],
                ['Step'],
                10,
                20,
                4,
                'easy',
                'Cat',
                null,
                createdDate,
                updatedDate
            );

            const viewModel = RecipeViewModelMapper.toViewModel(recipe);

            expect(viewModel.createdAt).toBe(createdDate);
            expect(viewModel.updatedAt).toBe(updatedDate);
        });

        it('should handle recipe with large time values', () => {
            const recipeWithLongTime = new Recipe(
                '1',
                'Long Recipe',
                'Long Description',
                ['Ing'],
                ['Step'],
                120,
                180,
                4,
                'hard',
                'Cat',
                null,
                new Date(),
                new Date()
            );

            const viewModel = RecipeViewModelMapper.toViewModel(recipeWithLongTime);

            expect(viewModel.prepTime).toBe(120);
            expect(viewModel.cookTime).toBe(180);
            expect(viewModel.totalTime).toBe(300);
        });

        it('should handle recipe with many ingredients', () => {
            const manyIngredients = Array.from({ length: 20 }, (_, i) => `Ingredient ${i + 1}`);
            const recipeWithManyIngredients = new Recipe(
                '1',
                'Complex Recipe',
                'Complex Description',
                manyIngredients,
                ['Step'],
                10,
                20,
                4,
                'hard',
                'Cat',
                null,
                new Date(),
                new Date()
            );

            const viewModel = RecipeViewModelMapper.toViewModel(recipeWithManyIngredients);

            expect(viewModel.ingredients.length).toBe(20);
            expect(viewModel.ingredients).toEqual(manyIngredients);
        });

        it('should handle recipe with many instructions', () => {
            const manyInstructions = Array.from({ length: 15 }, (_, i) => `Step ${i + 1}`);
            const recipeWithManySteps = new Recipe(
                '1',
                'Detailed Recipe',
                'Detailed Description',
                ['Ing'],
                manyInstructions,
                10,
                20,
                4,
                'hard',
                'Cat',
                null,
                new Date(),
                new Date()
            );

            const viewModel = RecipeViewModelMapper.toViewModel(recipeWithManySteps);

            expect(viewModel.instructions.length).toBe(15);
            expect(viewModel.instructions).toEqual(manyInstructions);
        });
    });

    describe('toViewModels', () => {
        it('should convert array of Recipes to array of ViewModels', () => {
            const recipes = [
                mockRecipe,
                new Recipe(
                    '456',
                    'Recipe 2',
                    'Description 2',
                    ['Ing2'],
                    ['Step2'],
                    10,
                    15,
                    2,
                    'easy',
                    'Cat2',
                    null,
                    new Date(),
                    new Date()
                ),
                new Recipe(
                    '789',
                    'Recipe 3',
                    'Description 3',
                    ['Ing3'],
                    ['Step3'],
                    20,
                    25,
                    6,
                    'hard',
                    'Cat3',
                    'image3.jpg',
                    new Date(),
                    new Date()
                )
            ];

            const viewModels = RecipeViewModelMapper.toViewModels(recipes);

            expect(viewModels.length).toBe(3);
            expect(viewModels[0].id).toBe('123');
            expect(viewModels[1].id).toBe('456');
            expect(viewModels[2].id).toBe('789');
            expect(viewModels[0].name).toBe('Test Recipe');
            expect(viewModels[1].name).toBe('Recipe 2');
            expect(viewModels[2].name).toBe('Recipe 3');
        });

        it('should return empty array for empty input', () => {
            const viewModels = RecipeViewModelMapper.toViewModels([]);

            expect(viewModels).toEqual([]);
            expect(viewModels.length).toBe(0);
        });

        it('should convert single recipe array', () => {
            const viewModels = RecipeViewModelMapper.toViewModels([mockRecipe]);

            expect(viewModels.length).toBe(1);
            expect(viewModels[0].id).toBe(mockRecipe.id);
        });

        it('should preserve order of recipes', () => {
            const recipes = [
                new Recipe('1', 'First', 'Desc 1', ['I'], ['S'], 10, 20, 4, 'easy', 'C', null, new Date(), new Date()),
                new Recipe('2', 'Second', 'Desc 2', ['I'], ['S'], 10, 20, 4, 'medium', 'C', null, new Date(), new Date()),
                new Recipe('3', 'Third', 'Desc 3', ['I'], ['S'], 10, 20, 4, 'hard', 'C', null, new Date(), new Date())
            ];

            const viewModels = RecipeViewModelMapper.toViewModels(recipes);

            expect(viewModels[0].name).toBe('First');
            expect(viewModels[1].name).toBe('Second');
            expect(viewModels[2].name).toBe('Third');
        });

        it('should correctly map all difficulty colors', () => {
            const recipes = [
                new Recipe('1', 'Easy', 'Desc', ['I'], ['S'], 10, 20, 4, 'easy', 'C', null, new Date(), new Date()),
                new Recipe('2', 'Medium', 'Desc', ['I'], ['S'], 10, 20, 4, 'medium', 'C', null, new Date(), new Date()),
                new Recipe('3', 'Hard', 'Desc', ['I'], ['S'], 10, 20, 4, 'hard', 'C', null, new Date(), new Date())
            ];

            const viewModels = RecipeViewModelMapper.toViewModels(recipes);

            expect(viewModels[0].difficultyColor).toBe('#10b981');
            expect(viewModels[1].difficultyColor).toBe('#f59e0b');
            expect(viewModels[2].difficultyColor).toBe('#ef4444');
        });

        it('should calculate totalTime for all recipes', () => {
            const recipes = [
                new Recipe('1', 'R1', 'Desc', ['I'], ['S'], 10, 20, 4, 'easy', 'C', null, new Date(), new Date()),
                new Recipe('2', 'R2', 'Desc', ['I'], ['S'], 15, 25, 4, 'medium', 'C', null, new Date(), new Date()),
                new Recipe('3', 'R3', 'Desc', ['I'], ['S'], 30, 45, 4, 'hard', 'C', null, new Date(), new Date())
            ];

            const viewModels = RecipeViewModelMapper.toViewModels(recipes);

            expect(viewModels[0].totalTime).toBe(30);
            expect(viewModels[1].totalTime).toBe(40);
            expect(viewModels[2].totalTime).toBe(75);
        });

        it('should handle large arrays of recipes', () => {
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
                    'medium',
                    'Cat',
                    null,
                    new Date(),
                    new Date()
                )
            );

            const viewModels = RecipeViewModelMapper.toViewModels(manyRecipes);

            expect(viewModels.length).toBe(100);
            viewModels.forEach((vm, index) => {
                expect(vm.id).toBe(`${index}`);
                expect(vm.name).toBe(`Recipe ${index}`);
            });
        });
    });

    describe('RecipeViewModel interface', () => {
        it('should have all required properties', () => {
            const viewModel: RecipeViewModel = RecipeViewModelMapper.toViewModel(mockRecipe);

            expect(viewModel).toHaveProperty('id');
            expect(viewModel).toHaveProperty('name');
            expect(viewModel).toHaveProperty('description');
            expect(viewModel).toHaveProperty('ingredients');
            expect(viewModel).toHaveProperty('instructions');
            expect(viewModel).toHaveProperty('prepTime');
            expect(viewModel).toHaveProperty('cookTime');
            expect(viewModel).toHaveProperty('totalTime');
            expect(viewModel).toHaveProperty('servings');
            expect(viewModel).toHaveProperty('difficulty');
            expect(viewModel).toHaveProperty('difficultyColor');
            expect(viewModel).toHaveProperty('category');
            expect(viewModel).toHaveProperty('imageUrl');
            expect(viewModel).toHaveProperty('createdAt');
            expect(viewModel).toHaveProperty('updatedAt');
        });

        it('should have correct property types', () => {
            const viewModel: RecipeViewModel = RecipeViewModelMapper.toViewModel(mockRecipe);

            expect(typeof viewModel.id).toBe('string');
            expect(typeof viewModel.name).toBe('string');
            expect(typeof viewModel.description).toBe('string');
            expect(Array.isArray(viewModel.ingredients)).toBe(true);
            expect(Array.isArray(viewModel.instructions)).toBe(true);
            expect(typeof viewModel.prepTime).toBe('number');
            expect(typeof viewModel.cookTime).toBe('number');
            expect(typeof viewModel.totalTime).toBe('number');
            expect(typeof viewModel.servings).toBe('number');
            expect(typeof viewModel.difficulty).toBe('string');
            expect(typeof viewModel.difficultyColor).toBe('string');
            expect(typeof viewModel.category).toBe('string');
            expect(viewModel.createdAt).toBeInstanceOf(Date);
            expect(viewModel.updatedAt).toBeInstanceOf(Date);
        });
    });
});
