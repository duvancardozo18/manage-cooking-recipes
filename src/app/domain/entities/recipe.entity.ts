import { RecipeName } from '../value-objects/recipe-name.value-object';
import { CookingTime } from '../value-objects/cooking-time.value-object';
import { Servings } from '../value-objects/servings.value-object';
import { Difficulty } from '../value-objects/difficulty.value-object';
import { Category } from '../value-objects/category.value-object';

export class Recipe {
    constructor(
        public readonly id: string,
        public readonly name: RecipeName,
        public readonly description: string,
        public readonly ingredients: string[],
        public readonly instructions: string[],
        public readonly prepTime: CookingTime,
        public readonly cookTime: CookingTime,
        public readonly servings: Servings,
        public readonly difficulty: Difficulty,
        public readonly category: Category,
        public readonly imageUrl: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    getTotalTime(): CookingTime {
        return this.prepTime.add(this.cookTime);
    }
}
