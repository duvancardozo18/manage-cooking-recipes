export type CategoryType =
    | 'Beef'
    | 'Chicken'
    | 'Pork'
    | 'Seafood'
    | 'Vegetarian'
    | 'Vegan'
    | 'Pasta'
    | 'Dessert'
    | 'Breakfast'
    | 'Salad'
    | 'Soup'
    | 'Appetizer';

export class Category {
    // Predefined categories in English
    static readonly BEEF = 'Beef';
    static readonly CHICKEN = 'Chicken';
    static readonly PORK = 'Pork';
    static readonly SEAFOOD = 'Seafood';
    static readonly VEGETARIAN = 'Vegetarian';
    static readonly VEGAN = 'Vegan';
    static readonly PASTA = 'Pasta';
    static readonly DESSERT = 'Dessert';
    static readonly BREAKFAST = 'Breakfast';
    static readonly SALAD = 'Salad';
    static readonly SOUP = 'Soup';
    static readonly APPETIZER = 'Appetizer';

    private static readonly VALID_CATEGORIES: string[] = [
        Category.BEEF,
        Category.CHICKEN,
        Category.PORK,
        Category.SEAFOOD,
        Category.VEGETARIAN,
        Category.VEGAN,
        Category.PASTA,
        Category.DESSERT,
        Category.BREAKFAST,
        Category.SALAD,
        Category.SOUP,
        Category.APPETIZER
    ];

    private constructor(private readonly value: string) { }

    static create(value: string): Category {
        const trimmed = value?.trim();

        if (!trimmed) {
            throw new Error('Category cannot be empty');
        }

        if (typeof value !== 'string') {
            throw new Error('Category must be a string');
        }

        // Allow any category value for flexibility, but normalize known ones
        const normalized = this.normalizeCategory(trimmed);
        return new Category(normalized);
    }

    private static normalizeCategory(value: string): string {
        // Check if it's a known category (case-insensitive)
        const found = this.VALID_CATEGORIES.find(
            cat => cat.toLowerCase() === value.toLowerCase()
        );
        return found || value; // Return normalized or original value
    }

    static isValid(value: string): boolean {
        return !!value && typeof value === 'string' && value.trim().length > 0;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Category): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
