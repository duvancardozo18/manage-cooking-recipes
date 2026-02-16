export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number; // in minutes
    cookTime: number; // in minutes
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecipeFormData {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    imageUrl?: string;
}
