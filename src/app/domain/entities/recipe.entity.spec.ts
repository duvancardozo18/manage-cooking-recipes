import { Recipe } from './recipe.entity';
import { RecipeName } from '../value-objects/recipe-name.value-object';
import { CookingTime } from '../value-objects/cooking-time.value-object';
import { Servings } from '../value-objects/servings.value-object';
import { Difficulty } from '../value-objects/difficulty.value-object';
import { Category } from '../value-objects/category.value-object';

describe('Recipe', () => {
    let recipe: Recipe;
    const mockId = '123';
    const mockName = RecipeName.create('Pasta Carbonara');
    const mockDescription = 'Classic Italian pasta dish';
    const mockIngredients = ['Pasta', 'Eggs', 'Bacon', 'Parmesan'];
    const mockInstructions = ['Boil pasta', 'Fry bacon', 'Mix with eggs and cheese'];
    const mockPrepTime = CookingTime.create(15);
    const mockCookTime = CookingTime.create(20);
    const mockServings = Servings.create(4);
    const mockDifficulty = Difficulty.create('medium');
    const mockCategory = Category.create('Pasta');
    const mockImageUrl = 'https://example.com/image.jpg';
    const mockCreatedAt = new Date('2024-01-01');
    const mockUpdatedAt = new Date('2024-01-02');

    beforeEach(() => {
        recipe = new Recipe(
            mockId,
            mockName,
            mockDescription,
            mockIngredients,
            mockInstructions,
            mockPrepTime,
            mockCookTime,
            mockServings,
            mockDifficulty,
            mockCategory,
            mockImageUrl,
            mockCreatedAt,
            mockUpdatedAt
        );
    });

    describe('constructor', () => {
        it('should create a recipe with all properties', () => {
            expect(recipe.id).toBe(mockId);
            expect(recipe.name).toBe(mockName);
            expect(recipe.description).toBe(mockDescription);
            expect(recipe.ingredients).toEqual(mockIngredients);
            expect(recipe.instructions).toEqual(mockInstructions);
            expect(recipe.prepTime).toBe(mockPrepTime);
            expect(recipe.cookTime).toBe(mockCookTime);
            expect(recipe.servings).toBe(mockServings);
            expect(recipe.difficulty).toBe(mockDifficulty);
            expect(recipe.category).toBe(mockCategory);
            expect(recipe.imageUrl).toBe(mockImageUrl);
            expect(recipe.createdAt).toBe(mockCreatedAt);
            expect(recipe.updatedAt).toBe(mockUpdatedAt);
        });

        it('should create a recipe without image URL', () => {
            const recipeWithoutImage = new Recipe(
                mockId,
                mockName,
                mockDescription,
                mockIngredients,
                mockInstructions,
                mockPrepTime,
                mockCookTime,
                mockServings,
                mockDifficulty,
                mockCategory,
                null,
                mockCreatedAt,
                mockUpdatedAt
            );

            expect(recipeWithoutImage.imageUrl).toBeNull();
        });
    });

    describe('getTotalTime', () => {
        it('should return the sum of prep time and cook time', () => {
            const totalTime = recipe.getTotalTime();
            expect(totalTime.getValue()).toBe(35); // 15 + 20
        });

        it('should calculate correct total time for different values', () => {
            const recipeWithDifferentTimes = new Recipe(
                mockId,
                mockName,
                mockDescription,
                mockIngredients,
                mockInstructions,
                CookingTime.create(30),
                CookingTime.create(45),
                mockServings,
                mockDifficulty,
                mockCategory,
                mockImageUrl,
                mockCreatedAt,
                mockUpdatedAt
            );

            const totalTime = recipeWithDifferentTimes.getTotalTime();
            expect(totalTime.getValue()).toBe(75); // 30 + 45
        });

        it('should handle zero prep time', () => {
            const recipeWithZeroPrepTime = new Recipe(
                mockId,
                mockName,
                mockDescription,
                mockIngredients,
                mockInstructions,
                CookingTime.create(0),
                CookingTime.create(30),
                mockServings,
                mockDifficulty,
                mockCategory,
                mockImageUrl,
                mockCreatedAt,
                mockUpdatedAt
            );

            const totalTime = recipeWithZeroPrepTime.getTotalTime();
            expect(totalTime.getValue()).toBe(30);
        });
    });

    describe('immutability', () => {
        it('should have readonly properties defined', () => {
            // TypeScript readonly is compile-time only
            // Verify the object properties exist
            expect(recipe.id).toBeDefined();
            expect(recipe.name).toBeDefined();
            expect(recipe.description).toBeDefined();
        });
    });
});
