import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-filter-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './filter-bar.component.html',
    styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {

    @Input() searchQuery: string = '';
    @Input() selectedCategory: string = '';
    @Input() selectedDifficulty: string = '';
    @Input() categories: string[] = [];
    @Output() searchQueryChange = new EventEmitter<string>();
    @Output() categoryChange = new EventEmitter<string>();
    @Output() difficultyChange = new EventEmitter<string>();
    @Output() clearFilters = new EventEmitter<void>();

    onSearchChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        console.log('🔔 [FilterBar -> Parent] Emitiendo cambio de búsqueda:', value);
        this.searchQueryChange.emit(value);
    }

    onCategoryChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        console.log('🔔 [FilterBar -> Parent] Emitiendo cambio de categoría:', value);
        this.categoryChange.emit(value);
    }

    onDifficultyChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        console.log('🔔 [FilterBar -> Parent] Emitiendo cambio de dificultad:', value);
        this.difficultyChange.emit(value);
    }

    onClearFilters(): void {
        console.log('🔔 [FilterBar -> Parent] Emitiendo evento limpiar filtros');
        this.clearFilters.emit();
    }


    hasActiveFilters(): boolean {
        return !!(this.searchQuery || this.selectedCategory || this.selectedDifficulty);
    }
}
