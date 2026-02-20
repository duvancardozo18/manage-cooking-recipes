import { Component, OnInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { RecipeViewModel, RecipeViewModelMapper } from '../../presentation/view-models/recipe.view-model';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeEventService } from '../../infrastructure/services/recipe-event.service';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';

@Component({
    selector: 'app-recipe-list',
    imports: [CommonModule, RouterLink, RecipeCardComponent, FilterBarComponent],
    templateUrl: './recipe-list.component.html',
    styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy {
    private recipeService = inject(RecipeApplicationService);
    private eventService = inject(RecipeEventService);
    private router = inject(Router);
    private subscriptions = new Subscription();

    notificationMessage = signal<string | null>(null);

    constructor() {
        console.log('RecipeListComponent - Constructor llamado');
    }

    searchQuery = signal('');
    selectedCategory = signal('');
    selectedDifficulty = signal('');

    recipes = computed(() => RecipeViewModelMapper.toViewModels(this.recipeService.getRecipes()));
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

        this.subscriptions.add(
            this.eventService.recipeAdded$.subscribe((recipe: Recipe) => {
                console.log('[Observer] Nueva receta agregada:', recipe);
                this.showNotification(`¡Nueva receta "${recipe.name}" agregada exitosamente!`);
            })
        );

        this.subscriptions.add(
            this.eventService.recipeUpdated$.subscribe((recipe: Recipe) => {
                console.log(' [Observer] Receta actualizada:', recipe);
                this.showNotification(`Receta "${recipe.name}" actualizada exitosamente`);
            })
        );

        this.subscriptions.add(
            this.eventService.recipeDeleted$.subscribe((id: string) => {
                console.log(' [Observer] Receta eliminada con ID:', id);
                this.showNotification('Receta eliminada exitosamente');
            })
        );
    }

    ngOnDestroy(): void {
        console.log('RecipeListComponent - ngOnDestroy ejecutado');
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

    
    handleSearchChange(value: string): void {
        console.log('📥 [Parent] Recibiendo evento de búsqueda del hijo FilterBar:', value);
        this.searchQuery.set(value);
    }


    handleCategoryChange(value: string): void {
        console.log('📥 [Parent] Recibiendo evento de categoría del hijo FilterBar:', value);
        this.selectedCategory.set(value);
    }


    handleDifficultyChange(value: string): void {
        console.log('📥 [Parent] Recibiendo evento de dificultad del hijo FilterBar:', value);
        this.selectedDifficulty.set(value);
    }


    handleClearFilters(): void {
        console.log('📥 [Parent] Recibiendo evento de limpiar filtros del hijo FilterBar');
        this.clearFilters();
    }


    handleEditRecipe(id: string): void {
        console.log('📥 [Parent] Recibiendo evento de editar receta del hijo RecipeCard:', id);
        this.router.navigate(['/recipes', id, 'edit']);
    }


    handleDeleteRecipe(id: string): void {
        console.log('📥 [Parent] Recibiendo evento de eliminar receta del hijo RecipeCard:', id);
        if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            this.recipeService.deleteRecipe(id);
        }
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

   
    private showNotification(message: string): void {
        this.notificationMessage.set(message);
        setTimeout(() => {
            this.notificationMessage.set(null);
        }, 3000);
    }
}

