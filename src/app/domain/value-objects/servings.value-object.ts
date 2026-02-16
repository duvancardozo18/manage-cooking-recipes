export class Servings {
    private static readonly MIN_SERVINGS = 1;
    private static readonly MAX_SERVINGS = 100;

    private constructor(private readonly value: number) { }

    static create(value: number): Servings {
        if (value < this.MIN_SERVINGS) {
            throw new Error(`Servings must be at least ${this.MIN_SERVINGS}`);
        }

        if (value > this.MAX_SERVINGS) {
            throw new Error(`Servings cannot exceed ${this.MAX_SERVINGS}`);
        }

        if (!Number.isInteger(value)) {
            throw new Error('Servings must be a whole number');
        }

        return new Servings(value);
    }

    getValue(): number {
        return this.value;
    }

    multiply(factor: number): Servings {
        return Servings.create(Math.round(this.value * factor));
    }

    equals(other: Servings): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return `${this.value} serving${this.value !== 1 ? 's' : ''}`;
    }
}
