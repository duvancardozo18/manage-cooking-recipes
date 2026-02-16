import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cookingTime',
    standalone: true
})
export class CookingTimePipe implements PipeTransform {
    transform(minutes: number | null | undefined): string {
        if (minutes === null || minutes === undefined || minutes === 0) {
            return 'No especificado';
        }

        if (minutes < 0) {
            return 'Tiempo inválido';
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        }

        if (remainingMinutes === 0) {
            return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        }

        const hourText = hours === 1 ? 'hora' : 'horas';
        const minuteText = remainingMinutes === 1 ? 'minuto' : 'minutos';
        return `${hours} ${hourText} ${remainingMinutes} ${minuteText}`;
    }
}
