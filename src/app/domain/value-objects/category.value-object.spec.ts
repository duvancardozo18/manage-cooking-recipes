import { Category } from './category.value-object';

describe('Category', () => {
    describe('create', () => {
        it('should create a valid category with known value', () => {
            const category = Category.create('Beef');
            expect(category.getValue()).toBe('Beef');
        });

        it('should normalize known categories case-insensitively', () => {
            const category = Category.create('beef');
            expect(category.getValue()).toBe('Beef');
        });

        it('should create category with custom value', () => {
            const category = Category.create('CustomCategory');
            expect(category.getValue()).toBe('CustomCategory');
        });

        it('should throw error for empty category', () => {
            expect(() => Category.create('')).toThrow('Category cannot be empty');
        });

        it('should throw error for null/undefined category', () => {
            expect(() => Category.create(null as any)).toThrow('Category cannot be empty');
            expect(() => Category.create(undefined as any)).toThrow('Category cannot be empty');
        });

        it('should trim whitespace from category', () => {
            const category = Category.create('  Chicken  ');
            expect(category.getValue()).toBe('Chicken');
        });
    });

    describe('isValid', () => {
        it('should return true for non-empty strings', () => {
            expect(Category.isValid('Beef')).toBe(true);
            expect(Category.isValid('CustomCategory')).toBe(true);
        });

        it('should return false for empty/whitespace strings', () => {
            expect(Category.isValid('')).toBe(false);
            expect(Category.isValid('   ')).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for equal categories', () => {
            const category1 = Category.create('Beef');
            const category2 = Category.create('Beef');
            expect(category1.equals(category2)).toBe(true);
        });

        it('should return false for different categories', () => {
            const category1 = Category.create('Beef');
            const category2 = Category.create('Chicken');
            expect(category1.equals(category2)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return the category value as string', () => {
            const category = Category.create('Vegetarian');
            expect(category.toString()).toBe('Vegetarian');
        });
    });

    describe('predefined categories', () => {
        it('should have all predefined categories as static properties', () => {
            expect(Category.BEEF).toBe('Beef');
            expect(Category.CHICKEN).toBe('Chicken');
            expect(Category.PORK).toBe('Pork');
            expect(Category.SEAFOOD).toBe('Seafood');
            expect(Category.VEGETARIAN).toBe('Vegetarian');
            expect(Category.VEGAN).toBe('Vegan');
            expect(Category.PASTA).toBe('Pasta');
            expect(Category.DESSERT).toBe('Dessert');
            expect(Category.BREAKFAST).toBe('Breakfast');
            expect(Category.SALAD).toBe('Salad');
            expect(Category.SOUP).toBe('Soup');
            expect(Category.APPETIZER).toBe('Appetizer');
        });
    });
});
