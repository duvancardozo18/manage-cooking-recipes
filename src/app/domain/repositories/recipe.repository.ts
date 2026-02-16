import { Recipe } from '../entities/recipe.entity';

export interface RecipeRepository {
    findAll(): Recipe[];
    findById(id: string): Recipe | null;
    save(recipe: Recipe): Recipe;
    update(recipe: Recipe): Recipe;
    delete(id: string): boolean;
    findByCategory(category: string): Recipe[];
    findByDifficulty(difficulty: string): Recipe[];
    search(query: string): Recipe[];
}
