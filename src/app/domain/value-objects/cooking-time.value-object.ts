export class CookingTime {
    private static readonly MIN_TIME = 0;
    private static readonly MAX_TIME = 1440; // 24 hours in minutes

    private constructor(private readonly minutes: number) { }

    static create(minutes: number): CookingTime {
        if (typeof minutes !== 'number' || isNaN(minutes)) {
            throw new Error('Cooking time must be a valid number');
        }

        if (minutes < this.MIN_TIME) {
            throw new Error('Cooking time cannot be negative');
        }

        if (minutes > this.MAX_TIME) {
            throw new Error(`Cooking time cannot exceed ${this.MAX_TIME} minutes (24 hours)`);
        }

        if (!Number.isInteger(minutes)) {
            throw new Error('Cooking time must be a whole number of minutes');
        }

        return new CookingTime(minutes);
    }

    getValue(): number {
        return this.minutes;
    }

    add(other: CookingTime): CookingTime {
        return CookingTime.create(this.minutes + other.minutes);
    }

    equals(other: CookingTime): boolean {
        return this.minutes === other.minutes;
    }

    toString(): string {
        return `${this.minutes} minutes`;
    }
}
