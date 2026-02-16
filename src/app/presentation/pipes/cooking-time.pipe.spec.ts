import { CookingTimePipe } from './cooking-time.pipe';

describe('CookingTimePipe', () => {
    let pipe: CookingTimePipe;

    beforeEach(() => {
        pipe = new CookingTimePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('transform', () => {
        it('should return "No especificado" for null', () => {
            expect(pipe.transform(null)).toBe('No especificado');
        });

        it('should return "No especificado" for undefined', () => {
            expect(pipe.transform(undefined)).toBe('No especificado');
        });

        it('should return "No especificado" for 0', () => {
            expect(pipe.transform(0)).toBe('No especificado');
        });

        it('should return "Tiempo inválido" for negative numbers', () => {
            expect(pipe.transform(-5)).toBe('Tiempo inválido');
            expect(pipe.transform(-100)).toBe('Tiempo inválido');
        });

        it('should format 1 minute correctly', () => {
            expect(pipe.transform(1)).toBe('1 minuto');
        });

        it('should format multiple minutes correctly', () => {
            expect(pipe.transform(30)).toBe('30 minutos');
            expect(pipe.transform(45)).toBe('45 minutos');
        });

        it('should format 1 hour (60 minutes) correctly', () => {
            expect(pipe.transform(60)).toBe('1 hora');
        });

        it('should format multiple hours correctly', () => {
            expect(pipe.transform(120)).toBe('2 horas');
            expect(pipe.transform(180)).toBe('3 horas');
        });

        it('should format hours and minutes correctly', () => {
            expect(pipe.transform(61)).toBe('1 hora 1 minuto');
            expect(pipe.transform(65)).toBe('1 hora 5 minutos');
            expect(pipe.transform(125)).toBe('2 horas 5 minutos');
            expect(pipe.transform(121)).toBe('2 horas 1 minuto');
        });

        it('should handle large values correctly', () => {
            expect(pipe.transform(1440)).toBe('24 horas'); // 1 day
            expect(pipe.transform(1500)).toBe('25 horas'); // 1 day + 1 hour
        });
    });
});
