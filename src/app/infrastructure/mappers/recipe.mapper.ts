import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeDto } from '../dtos/recipe.dto';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

export class RecipeMapper {
    static toDto(recipe: Recipe): RecipeDto {
        return {
            id: recipe.id,
            name: recipe.name.getValue(),
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime.getValue(),
            cookTime: recipe.cookTime.getValue(),
            servings: recipe.servings.getValue(),
            difficulty: recipe.difficulty.getValue(),
            category: recipe.category.getValue(),
            imageUrl: recipe.imageUrl,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        };
    }

    static toDomain(dto: RecipeDto): Recipe {
        return new Recipe(
            dto.id,
            RecipeName.create(dto.name),
            dto.description,
            dto.ingredients,
            dto.instructions,
            CookingTime.create(dto.prepTime),
            CookingTime.create(dto.cookTime),
            Servings.create(dto.servings),
            Difficulty.create(dto.difficulty),
            Category.create(dto.category),
            dto.imageUrl,
            dto.createdAt,
            dto.updatedAt
        );
    }
}
