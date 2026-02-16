import { Component, OnInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { RecipeViewModel, RecipeViewModelMapper } from '../../presentation/view-models/recipe.view-model';
import { DifficultyPipe } from '../../presentation/pipes/difficulty.pipe';

@Component({
    selector: 'app-recipe-list',
    imports: [CommonModule, RouterLink, FormsModule, DifficultyPipe],
    templateUrl: './recipe-list.component.html',
    styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy {
    private recipeService = inject(RecipeApplicationService);
    private router = inject(Router);

    // Observer Pattern: Almacenar suscripciones para limpiarlas en ngOnDestroy
    private subscriptions = new Subscription();

    // Signal para mostrar mensajes de notificación
    notificationMessage = signal<string | null>(null);

    constructor() {
        console.log('RecipeListComponent - Constructor llamado');
    }

    searchQuery = signal('');
    selectedCategory = signal('');
    selectedDifficulty = signal('');

    // Convert domain entities to view models for presentation
    recipes = computed(() => RecipeViewModelMapper.toViewModels(this.recipeService.getRecipes()()));
    categories = computed(() => this.recipeService.getCategories());

    filteredRecipes = computed(() => {
        let filtered = this.recipes();

        if (this.searchQuery()) {
            const searchResults = this.recipeService.searchRecipes(this.searchQuery());
            filtered = RecipeViewModelMapper.toViewModels(searchResults);
        }

        if (this.selectedCategory()) {
            filtered = filtered.filter(r => r.category === this.selectedCategory());
        }

        if (this.selectedDifficulty()) {
            filtered = filtered.filter(r => r.difficulty === this.selectedDifficulty());
        }

        return filtered;
    });

    ngOnInit(): void {
        console.log('RecipeListComponent - ngOnInit ejecutado');

        // Observer Pattern: Suscribirse a las notificaciones de nuevas recetas
        this.subscriptions.add(
            this.recipeService.recipeAdded$.subscribe(recipe => {
                console.log('[Observer] Nueva receta agregada:', recipe);
                this.showNotification(`¡Nueva receta "${recipe.name}" agregada exitosamente!`);
            })
        );

        // Observer Pattern: Suscribirse a las notificaciones de actualización
        this.subscriptions.add(
            this.recipeService.recipeUpdated$.subscribe(recipe => {
                console.log(' [Observer] Receta actualizada:', recipe);
                this.showNotification(`Receta "${recipe.name}" actualizada exitosamente`);
            })
        );

        // Observer Pattern: Suscribirse a las notificaciones de eliminación
        this.subscriptions.add(
            this.recipeService.recipeDeleted$.subscribe(id => {
                console.log(' [Observer] Receta eliminada con ID:', id);
                this.showNotification('Receta eliminada exitosamente');
            })
        );
    }

    ngOnDestroy(): void {
        console.log('RecipeListComponent - ngOnDestroy ejecutado');
        // Observer Pattern: Cancelar todas las suscripciones para evitar memory leaks
        this.subscriptions.unsubscribe();
    }

    onSearchChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value);
    }

    onCategoryChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.selectedCategory.set(value);
    }

    onDifficultyChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.selectedDifficulty.set(value);
    }

    clearFilters(): void {
        this.searchQuery.set('');
        this.selectedCategory.set('');
        this.selectedDifficulty.set('');
    }

    deleteRecipe(id: string, event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            this.recipeService.deleteRecipe(id);
        }
    }

    getTotalTime(recipe: RecipeViewModel): number {
        return recipe.totalTime;
    }

    getDifficultyColor(recipe: RecipeViewModel): string {
        return recipe.difficultyColor;
    }

    // Método auxiliar para mostrar notificaciones
    private showNotification(message: string): void {
        this.notificationMessage.set(message);
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            this.notificationMessage.set(null);
        }, 3000);
    }
}

