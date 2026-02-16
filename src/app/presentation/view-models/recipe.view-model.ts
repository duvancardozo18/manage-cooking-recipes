import { Recipe, DifficultyLevel } from '../../domain/entities/recipe.entity';

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
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            totalTime: recipe.getTotalTime(),
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            difficultyColor: this.getDifficultyColor(recipe.difficulty),
            category: recipe.category,
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
