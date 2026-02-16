import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyLevel } from '../domain/value-objects/difficulty.value-object';

@Pipe({
    name: 'difficulty',
    standalone: true
})
export class DifficultyPipe implements PipeTransform {
    transform(difficulty: DifficultyLevel | null | undefined): string {
        if (!difficulty) {
            return 'No especificado';
        }

        switch (difficulty) {
            case 'easy':
                return 'Fácil';
            case 'medium':
                return 'Media';
            case 'hard':
                return 'Difícil';
            default:
                return difficulty;
        }
    }
}
