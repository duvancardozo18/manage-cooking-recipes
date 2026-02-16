import { CookingTimePipe } from './cooking-time.pipe';

describe('CookingTimePipe', () => {
    let pipe: CookingTimePipe;

    beforeEach(() => {
        pipe = new CookingTimePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return "No especificado" for null', () => {
        expect(pipe.transform(null)).toBe('No especificado');
    });

    it('should return "No especificado" for undefined', () => {
        expect(pipe.transform(undefined)).toBe('No especificado');
    });

    it('should return "No especificado" for 0', () => {
        expect(pipe.transform(0)).toBe('No especificado');
    });

    it('should return "Tiempo inválido" for negative values', () => {
        expect(pipe.transform(-5)).toBe('Tiempo inválido');
    });

    it('should format single minute correctly', () => {
        expect(pipe.transform(1)).toBe('1 minuto');
    });

    it('should format multiple minutes correctly', () => {
        expect(pipe.transform(45)).toBe('45 minutos');
    });

    it('should format single hour correctly', () => {
        expect(pipe.transform(60)).toBe('1 hora');
    });

    it('should format multiple hours correctly', () => {
        expect(pipe.transform(120)).toBe('2 horas');
    });

    it('should format hours and minutes correctly', () => {
        expect(pipe.transform(90)).toBe('1 hora 30 minutos');
    });

    it('should format multiple hours and single minute correctly', () => {
        expect(pipe.transform(121)).toBe('2 horas 1 minuto');
    });

    it('should format multiple hours and minutes correctly', () => {
        expect(pipe.transform(150)).toBe('2 horas 30 minutos');
    });
});
