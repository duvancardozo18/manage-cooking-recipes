import { RecipeViewModelMapper } from './recipe.view-model';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('RecipeViewModelMapper', () => {
    const mockRecipe1 = new Recipe(
        '1',
        RecipeName.create('Pasta Carbonara'),
        'A classic Italian pasta dish',
        ['Pasta', 'Eggs', 'Bacon'],
        ['Boil pasta', 'Fry bacon', 'Mix'],
        CookingTime.create(15),
        CookingTime.create(20),
        Servings.create(4),
        Difficulty.create('medium'),
        Category.create('Pasta'),
        'https://example.com/image.jpg',
        new Date('2024-01-01'),
        new Date('2024-01-02')
    );

    const mockRecipe2 = new Recipe(
        '2',
        RecipeName.create('Simple Salad'),
        'A simple and fresh salad',
        ['Lettuce', 'Tomato'],
        ['Mix ingredients'],
        CookingTime.create(5),
        CookingTime.create(0),
        Servings.create(2),
        Difficulty.create('easy'),
        Category.create('Salad'),
        null,
        new Date('2024-02-01'),
        new Date('2024-02-01')
    );

    describe('toViewModel', () => {
        it('should convert Recipe entity to view model', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe1);

            expect(viewModel.id).toBe(mockRecipe1.id);
            expect(viewModel.name).toBe(mockRecipe1.name.getValue());
            expect(viewModel.description).toBe(mockRecipe1.description);
            expect(viewModel.ingredients).toEqual(mockRecipe1.ingredients);
            expect(viewModel.instructions).toEqual(mockRecipe1.instructions);
            expect(viewModel.prepTime).toBe(15);
            expect(viewModel.cookTime).toBe(20);
            expect(viewModel.totalTime).toBe(35); // 15 + 20
            expect(viewModel.servings).toBe(4);
            expect(viewModel.difficulty).toBe('medium');
            expect(viewModel.category).toBe('Pasta');
            expect(viewModel.imageUrl).toBe('https://example.com/image.jpg');
            expect(viewModel.createdAt).toBe(mockRecipe1.createdAt);
            expect(viewModel.updatedAt).toBe(mockRecipe1.updatedAt);
        });

        it('should calculate total time correctly', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe1);
            expect(viewModel.totalTime).toBe(35);
        });

        it('should set difficulty color for easy', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe2);
            expect(viewModel.difficultyColor).toBe('#10b981');
        });

        it('should set difficulty color for medium', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe1);
            expect(viewModel.difficultyColor).toBe('#f59e0b');
        });

        it('should set difficulty color for hard', () => {
            const hardRecipe = new Recipe(
                '3',
                RecipeName.create('Complex Dish'),
                'A very complex dish',
                ['Many ingredients'],
                ['Complex steps'],
                CookingTime.create(30),
                CookingTime.create(60),
                Servings.create(4),
                Difficulty.create('hard'),
                Category.create('Advanced'),
                null,
                new Date(),
                new Date()
            );

            const viewModel = RecipeViewModelMapper.toViewModel(hardRecipe);
            expect(viewModel.difficultyColor).toBe('#ef4444');
        });

        it('should handle null imageUrl', () => {
            const viewModel = RecipeViewModelMapper.toViewModel(mockRecipe2);
            expect(viewModel.imageUrl).toBeNull();
        });
    });

    describe('toViewModels', () => {
        it('should convert multiple recipes to view models', () => {
            const recipes = [mockRecipe1, mockRecipe2];
            const viewModels = RecipeViewModelMapper.toViewModels(recipes);

            expect(viewModels).toHaveLength(2);
            expect(viewModels[0].id).toBe(mockRecipe1.id);
            expect(viewModels[1].id).toBe(mockRecipe2.id);
        });

        it('should return empty array for empty input', () => {
            const viewModels = RecipeViewModelMapper.toViewModels([]);
            expect(viewModels).toEqual([]);
        });

        it('should preserve order of recipes', () => {
            const recipes = [mockRecipe1, mockRecipe2];
            const viewModels = RecipeViewModelMapper.toViewModels(recipes);

            expect(viewModels[0].name).toBe('Pasta Carbonara');
            expect(viewModels[1].name).toBe('Simple Salad');
        });
    });
});
