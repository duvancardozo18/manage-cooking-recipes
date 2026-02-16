import { RecipeName } from './recipe-name.value-object';

describe('RecipeName', () => {
    describe('create', () => {
        it('should create a valid recipe name', () => {
            const name = RecipeName.create('Pasta Carbonara');
            expect(name.getValue()).toBe('Pasta Carbonara');
        });

        it('should create recipe name at minimum length', () => {
            const name = RecipeName.create('Pie');
            expect(name.getValue()).toBe('Pie');
        });

        it('should create recipe name at maximum length', () => {
            const longName = 'A'.repeat(100);
            const name = RecipeName.create(longName);
            expect(name.getValue()).toBe(longName);
        });

        it('should trim whitespace from recipe name', () => {
            const name = RecipeName.create('  Pasta Carbonara  ');
            expect(name.getValue()).toBe('Pasta Carbonara');
        });

        it('should throw error for empty name', () => {
            expect(() => RecipeName.create('')).toThrow('Recipe name cannot be empty');
        });

        it('should throw error for null/undefined name', () => {
            expect(() => RecipeName.create(null as any)).toThrow('Recipe name cannot be empty');
            expect(() => RecipeName.create(undefined as any)).toThrow('Recipe name cannot be empty');
        });

        it('should throw error for name too short', () => {
            expect(() => RecipeName.create('Ab')).toThrow(
                'Recipe name must be at least 3 characters long'
            );
        });

        it('should throw error for name too long', () => {
            const longName = 'A'.repeat(101);
            expect(() => RecipeName.create(longName)).toThrow(
                'Recipe name cannot exceed 100 characters'
            );
        });

        it('should throw error for whitespace-only name', () => {
            expect(() => RecipeName.create('   ')).toThrow('Recipe name cannot be empty');
        });
    });

    describe('equals', () => {
        it('should return true for equal recipe names', () => {
            const name1 = RecipeName.create('Lasagna');
            const name2 = RecipeName.create('Lasagna');
            expect(name1.equals(name2)).toBe(true);
        });

        it('should return false for different recipe names', () => {
            const name1 = RecipeName.create('Lasagna');
            const name2 = RecipeName.create('Pizza');
            expect(name1.equals(name2)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return the recipe name as string', () => {
            const name = RecipeName.create('Tiramisu');
            expect(name.toString()).toBe('Tiramisu');
        });
    });
});
