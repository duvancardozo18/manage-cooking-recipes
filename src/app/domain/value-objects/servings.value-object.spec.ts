import { Servings } from './servings.value-object';

describe('Servings', () => {
    describe('create', () => {
        it('should create valid servings', () => {
            const servings = Servings.create(4);
            expect(servings.getValue()).toBe(4);
        });

        it('should create minimum servings (1)', () => {
            const servings = Servings.create(1);
            expect(servings.getValue()).toBe(1);
        });

        it('should create maximum servings (100)', () => {
            const servings = Servings.create(100);
            expect(servings.getValue()).toBe(100);
        });

        it('should throw error for servings less than 1', () => {
            expect(() => Servings.create(0)).toThrow('Servings must be at least 1');
        });

        it('should throw error for negative servings', () => {
            expect(() => Servings.create(-5)).toThrow('Servings must be at least 1');
        });

        it('should throw error for servings exceeding 100', () => {
            expect(() => Servings.create(101)).toThrow('Servings cannot exceed 100');
        });

        it('should throw error for non-integer servings', () => {
            expect(() => Servings.create(4.5)).toThrow('Servings must be a whole number');
        });
    });

    describe('multiply', () => {
        it('should multiply servings by a factor', () => {
            const servings = Servings.create(4);
            const result = servings.multiply(2);
            expect(result.getValue()).toBe(8);
        });

        it('should round result to nearest integer', () => {
            const servings = Servings.create(3);
            const result = servings.multiply(1.5);
            expect(result.getValue()).toBe(5); // 3 * 1.5 = 4.5, rounded to 5
        });

        it('should throw error if result exceeds maximum', () => {
            const servings = Servings.create(60);
            expect(() => servings.multiply(2)).toThrow('Servings cannot exceed 100');
        });
    });

    describe('equals', () => {
        it('should return true for equal servings', () => {
            const servings1 = Servings.create(6);
            const servings2 = Servings.create(6);
            expect(servings1.equals(servings2)).toBe(true);
        });

        it('should return false for different servings', () => {
            const servings1 = Servings.create(4);
            const servings2 = Servings.create(6);
            expect(servings1.equals(servings2)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return singular form for 1 serving', () => {
            const servings = Servings.create(1);
            expect(servings.toString()).toBe('1 serving');
        });

        it('should return plural form for multiple servings', () => {
            const servings = Servings.create(4);
            expect(servings.toString()).toBe('4 servings');
        });
    });
});
