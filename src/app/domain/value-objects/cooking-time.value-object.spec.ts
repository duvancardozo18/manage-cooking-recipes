import { CookingTime } from './cooking-time.value-object';

describe('CookingTime', () => {
    describe('create', () => {
        it('should create a valid cooking time', () => {
            const cookingTime = CookingTime.create(30);
            expect(cookingTime.getValue()).toBe(30);
        });

        it('should accept zero minutes', () => {
            const cookingTime = CookingTime.create(0);
            expect(cookingTime.getValue()).toBe(0);
        });

        it('should accept maximum time (24 hours)', () => {
            const cookingTime = CookingTime.create(1440);
            expect(cookingTime.getValue()).toBe(1440);
        });

        it('should throw error for negative time', () => {
            expect(() => CookingTime.create(-1)).toThrow('Cooking time cannot be negative');
        });

        it('should throw error for time exceeding 24 hours', () => {
            expect(() => CookingTime.create(1441)).toThrow(
                'Cooking time cannot exceed 1440 minutes (24 hours)'
            );
        });

        it('should throw error for non-integer values', () => {
            expect(() => CookingTime.create(30.5)).toThrow(
                'Cooking time must be a whole number of minutes'
            );
        });
    });

    describe('add', () => {
        it('should add two cooking times', () => {
            const time1 = CookingTime.create(30);
            const time2 = CookingTime.create(45);
            const result = time1.add(time2);
            expect(result.getValue()).toBe(75);
        });

        it('should throw error if sum exceeds maximum', () => {
            const time1 = CookingTime.create(800);
            const time2 = CookingTime.create(700);
            expect(() => time1.add(time2)).toThrow(
                'Cooking time cannot exceed 1440 minutes (24 hours)'
            );
        });
    });

    describe('equals', () => {
        it('should return true for equal cooking times', () => {
            const time1 = CookingTime.create(60);
            const time2 = CookingTime.create(60);
            expect(time1.equals(time2)).toBe(true);
        });

        it('should return false for different cooking times', () => {
            const time1 = CookingTime.create(60);
            const time2 = CookingTime.create(90);
            expect(time1.equals(time2)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return formatted string', () => {
            const cookingTime = CookingTime.create(45);
            expect(cookingTime.toString()).toBe('45 minutes');
        });
    });
});
