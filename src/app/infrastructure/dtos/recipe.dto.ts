import { DifficultyLevel } from '../../domain/value-objects/difficulty.value-object';

export interface RecipeDto {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: DifficultyLevel;
    category: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateRecipeDto {
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

export interface UpdateRecipeDto {
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
