import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { RecipeViewModel, RecipeViewModelMapper } from '../../presentation/view-models/recipe.view-model';
import { CookingTimePipe } from '../../pipes/cooking-time.pipe';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';

@Component({
    selector: 'app-recipe-detail',
    imports: [CommonModule, RouterLink, CookingTimePipe, DifficultyPipe],
    templateUrl: './recipe-detail.component.html',
    styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
    recipe = signal<RecipeViewModel | undefined>(undefined);

    // Observer Pattern: Almacenar suscripciones
    private subscriptions = new Subscription();
    private currentRecipeId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipeApplicationService
    ) {
        console.log('RecipeDetailComponent - Constructor llamado');
    }

    ngOnInit(): void {
        console.log('RecipeDetailComponent - ngOnInit ejecutado');
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.currentRecipeId = id;
            const recipe = this.recipeService.getRecipeById(id);
            if (recipe) {
                this.recipe.set(RecipeViewModelMapper.toViewModel(recipe));
            } else {
                this.router.navigate(['/recipes']);
            }
        }

        // Observer Pattern: Suscribirse a actualizaciones de esta receta
        this.subscriptions.add(
            this.recipeService.recipeUpdated$.subscribe(recipe => {
                if (recipe.id === this.currentRecipeId) {
                    console.log('✏️ [Observer] Receta actual actualizada:', recipe);
                    this.recipe.set(RecipeViewModelMapper.toViewModel(recipe));
                }
            })
        );

        // Observer Pattern: Suscribirse a eliminación de recetas
        this.subscriptions.add(
            this.recipeService.recipeDeleted$.subscribe(id => {
                if (id === this.currentRecipeId) {
                    console.log('❌ [Observer] Receta actual eliminada, redirigiendo...');
                    this.router.navigate(['/recipes']);
                }
            })
        );
    }

    ngOnDestroy(): void {
        console.log('RecipeDetailComponent - ngOnDestroy ejecutado');
        // Observer Pattern: Cancelar todas las suscripciones
        this.subscriptions.unsubscribe();
    }

    deleteRecipe(): void {
        if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            const recipe = this.recipe();
            if (recipe) {
                this.recipeService.deleteRecipe(recipe.id);
                this.router.navigate(['/recipes']);
            }
        }
    }

    getTotalTime(): number {
        const recipe = this.recipe();
        if (!recipe) return 0;
        return recipe.totalTime;
    }

    getDifficultyColor(difficulty: string): string {
        const recipe = this.recipe();
        return recipe?.difficultyColor || '#6b7280';
    }
}
