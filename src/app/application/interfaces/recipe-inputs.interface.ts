import { DifficultyLevel } from '../../domain/value-objects/difficulty.value-object';

export interface CreateRecipeInput {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: DifficultyLevel;
    category: string;
    imageUrl?: string;
}

export interface UpdateRecipeInput {
    name?: string;
    description?: string;
    ingredients?: string[];
    instructions?: string[];
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: DifficultyLevel;
    category?: string;
    imageUrl?: string | null;
}
