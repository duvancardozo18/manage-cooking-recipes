import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Recipe } from '../../domain/entities/recipe.entity';


@Injectable({
    providedIn: 'root'
})
export class RecipeEventService {
    private recipeAddedSubject = new Subject<Recipe>();
    private recipeUpdatedSubject = new Subject<Recipe>();
    private recipeDeletedSubject = new Subject<string>();

    readonly recipeAdded$: Observable<Recipe> = this.recipeAddedSubject.asObservable();
    readonly recipeUpdated$: Observable<Recipe> = this.recipeUpdatedSubject.asObservable();
    readonly recipeDeleted$: Observable<string> = this.recipeDeletedSubject.asObservable();


    emitRecipeAdded(recipe: Recipe): void {
        this.recipeAddedSubject.next(recipe);
    }


    emitRecipeUpdated(recipe: Recipe): void {
        this.recipeUpdatedSubject.next(recipe);
    }

    emitRecipeDeleted(id: string): void {
        this.recipeDeletedSubject.next(id);
    }
}
