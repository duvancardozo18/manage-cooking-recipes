export class RecipeName {
    private static readonly MIN_LENGTH = 3;
    private static readonly MAX_LENGTH = 100;

    private constructor(private readonly value: string) { }

    static create(value: string): RecipeName {
        const trimmed = value?.trim();

        if (!trimmed) {
            throw new Error('Recipe name cannot be empty');
        }

        if (typeof value !== 'string') {
            throw new Error('Recipe name must be a string');
        }

        if (trimmed.length < this.MIN_LENGTH) {
            throw new Error(`Recipe name must be at least ${this.MIN_LENGTH} characters long`);
        }

        if (trimmed.length > this.MAX_LENGTH) {
            throw new Error(`Recipe name cannot exceed ${this.MAX_LENGTH} characters`);
        }

        return new RecipeName(trimmed);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: RecipeName): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
