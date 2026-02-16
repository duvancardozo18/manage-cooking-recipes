export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export class Difficulty {
    private constructor(private readonly value: DifficultyLevel) { }

    static create(value: string): Difficulty {
        if (!this.isValid(value)) {
            throw new Error(`Invalid difficulty level: ${value}. Must be 'easy', 'medium', or 'hard'`);
        }
        return new Difficulty(value as DifficultyLevel);
    }

    static isValid(value: string): boolean {
        return ['easy', 'medium', 'hard'].includes(value);
    }

    getValue(): DifficultyLevel {
        return this.value;
    }

    equals(other: Difficulty): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
