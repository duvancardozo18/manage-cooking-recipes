import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeViewModel } from '../../../presentation/view-models/recipe.view-model';
import { DifficultyPipe } from '../../../presentation/pipes/difficulty.pipe';
import { HighlightDirective } from '../../../presentation/directives/highlight.directive';
import { TooltipDirective } from '../../../presentation/directives/tooltip.directive';


@Component({
    selector: 'app-recipe-card',
    standalone: true,
    imports: [CommonModule, RouterLink, DifficultyPipe, HighlightDirective, TooltipDirective],
    templateUrl: './recipe-card.component.html',
    styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
    @Input({ required: true }) recipe!: RecipeViewModel;
    @Output() edit = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();


    getTotalTime(): number {
        return this.recipe.totalTime;
    }


    onEdit(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        console.log(' Emitiendo evento edit para receta:', this.recipe.id);
        this.edit.emit(this.recipe.id);
    }

    onDelete(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        console.log(' Emitiendo evento delete para receta:', this.recipe.id);
        this.delete.emit(this.recipe.id);
    }
}
