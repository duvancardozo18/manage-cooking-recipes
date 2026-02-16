// Domain Entity
export class Recipe {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly ingredients: string[],
        public readonly instructions: string[],
        public readonly prepTime: number,
        public readonly cookTime: number,
        public readonly servings: number,
        public readonly difficulty: DifficultyLevel,
        public readonly category: string,
        public readonly imageUrl: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    getTotalTime(): number {
        return this.prepTime + this.cookTime;
    }

    static create(data: RecipeCreationData): Recipe {
        const now = new Date();
        return new Recipe(
            Date.now().toString(),
            data.name,
            data.description,
            data.ingredients,
            data.instructions,
            data.prepTime,
            data.cookTime,
            data.servings,
            data.difficulty,
            data.category,
            data.imageUrl || null,
            now,
            now
        );
    }

    update(data: RecipeUpdateData): Recipe {
        return new Recipe(
            this.id,
            data.name ?? this.name,
            data.description ?? this.description,
            data.ingredients ?? this.ingredients,
            data.instructions ?? this.instructions,
            data.prepTime ?? this.prepTime,
            data.cookTime ?? this.cookTime,
            data.servings ?? this.servings,
            data.difficulty ?? this.difficulty,
            data.category ?? this.category,
            data.imageUrl !== undefined ? data.imageUrl : this.imageUrl,
            this.createdAt,
            new Date()
        );
    }
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface RecipeCreationData {
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

export interface RecipeUpdateData {
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

// DTOs for data transfer
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

export class RecipeMapper {
    static toDto(recipe: Recipe): RecipeDto {
        return {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            category: recipe.category,
            imageUrl: recipe.imageUrl,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        };
    }

    static toDomain(dto: RecipeDto): Recipe {
        return new Recipe(
            dto.id,
            dto.name,
            dto.description,
            dto.ingredients,
            dto.instructions,
            dto.prepTime,
            dto.cookTime,
            dto.servings,
            dto.difficulty,
            dto.category,
            dto.imageUrl,
            dto.createdAt,
            dto.updatedAt
        );
    }
}
