import { DifficultyPipe } from './difficulty.pipe';

describe('DifficultyPipe', () => {
    let pipe: DifficultyPipe;

    beforeEach(() => {
        pipe = new DifficultyPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('transform', () => {
        it('should return "No especificado" for null', () => {
            expect(pipe.transform(null)).toBe('No especificado');
        });

        it('should return "No especificado" for undefined', () => {
            expect(pipe.transform(undefined)).toBe('No especificado');
        });

        it('should transform "easy" to "Fácil"', () => {
            expect(pipe.transform('easy')).toBe('Fácil');
        });

        it('should transform "medium" to "Media"', () => {
            expect(pipe.transform('medium')).toBe('Media');
        });

        it('should transform "hard" to "Difícil"', () => {
            expect(pipe.transform('hard')).toBe('Difícil');
        });

        it('should return the original value for unknown difficulty', () => {
            expect(pipe.transform('unknown' as any)).toBe('unknown');
        });
    });
});
