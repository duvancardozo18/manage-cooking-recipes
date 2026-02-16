import { Recipe } from '../../domain/entities/recipe.entity';
import { DifficultyLevel } from '../../domain/value-objects/difficulty.value-object';

export interface RecipeViewModel {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number;
    cookTime: number;
    totalTime: number;
    servings: number;
    difficulty: DifficultyLevel;
    difficultyColor: string;
    category: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class RecipeViewModelMapper {
    static toViewModel(recipe: Recipe): RecipeViewModel {
        return {
            id: recipe.id,
            name: recipe.name.getValue(),
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime.getValue(),
            cookTime: recipe.cookTime.getValue(),
            totalTime: recipe.getTotalTime().getValue(),
            servings: recipe.servings.getValue(),
            difficulty: recipe.difficulty.getValue(),
            difficultyColor: this.getDifficultyColor(recipe.difficulty.getValue()),
            category: recipe.category.getValue(),
            imageUrl: recipe.imageUrl,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        };
    }

    static toViewModels(recipes: Recipe[]): RecipeViewModel[] {
        return recipes.map(r => this.toViewModel(r));
    }

    private static getDifficultyColor(difficulty: DifficultyLevel): string {
        switch (difficulty) {
            case 'easy': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'hard': return '#ef4444';
            default: return '#6b7280';
        }
    }
}
