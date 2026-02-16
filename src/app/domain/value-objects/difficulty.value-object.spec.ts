import { Difficulty } from './difficulty.value-object';

describe('Difficulty', () => {
    describe('create', () => {
        it('should create difficulty with easy level', () => {
            const difficulty = Difficulty.create('easy');
            expect(difficulty.getValue()).toBe('easy');
        });

        it('should create difficulty with medium level', () => {
            const difficulty = Difficulty.create('medium');
            expect(difficulty.getValue()).toBe('medium');
        });

        it('should create difficulty with hard level', () => {
            const difficulty = Difficulty.create('hard');
            expect(difficulty.getValue()).toBe('hard');
        });

        it('should throw error for invalid difficulty level', () => {
            expect(() => Difficulty.create('invalid')).toThrow(
                "Invalid difficulty level: invalid. Must be 'easy', 'medium', or 'hard'"
            );
        });

        it('should throw error for empty string', () => {
            expect(() => Difficulty.create('')).toThrow('Invalid difficulty level');
        });
    });

    describe('isValid', () => {
        it('should return true for valid difficulty levels', () => {
            expect(Difficulty.isValid('easy')).toBe(true);
            expect(Difficulty.isValid('medium')).toBe(true);
            expect(Difficulty.isValid('hard')).toBe(true);
        });

        it('should return false for invalid difficulty levels', () => {
            expect(Difficulty.isValid('invalid')).toBe(false);
            expect(Difficulty.isValid('')).toBe(false);
            expect(Difficulty.isValid('Easy')).toBe(false); // case-sensitive
        });
    });

    describe('equals', () => {
        it('should return true for equal difficulties', () => {
            const difficulty1 = Difficulty.create('medium');
            const difficulty2 = Difficulty.create('medium');
            expect(difficulty1.equals(difficulty2)).toBe(true);
        });

        it('should return false for different difficulties', () => {
            const difficulty1 = Difficulty.create('easy');
            const difficulty2 = Difficulty.create('hard');
            expect(difficulty1.equals(difficulty2)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return the difficulty level as string', () => {
            const difficulty = Difficulty.create('hard');
            expect(difficulty.toString()).toBe('hard');
        });
    });
});
