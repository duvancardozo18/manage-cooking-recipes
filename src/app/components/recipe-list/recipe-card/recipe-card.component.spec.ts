import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeCardComponent } from './recipe-card.component';
import { RecipeViewModel } from '../../../presentation/view-models/recipe.view-model';

describe('RecipeCardComponent', () => {
    let component: RecipeCardComponent;
    let fixture: ComponentFixture<RecipeCardComponent>;

    const mockRecipe: RecipeViewModel = {
        id: '1',
        name: 'Test Recipe',
        description: 'Test Description',
        category: 'Beef',
        difficulty: 'medium',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: ['Step 1', 'Step 2'],
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalTime: 45,
        difficultyColor: '#f59e0b'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RecipeCardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RecipeCardComponent);
        component = fixture.componentInstance;
        component.recipe = mockRecipe;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display recipe information', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.recipe-title').textContent).toContain('Test Recipe');
        expect(compiled.querySelector('.recipe-description').textContent).toContain('Test Description');
    });

    it('should emit edit event when edit button is clicked', (done) => {
        component.edit.subscribe((id) => {
            expect(id).toBe('1');
            done();
        });
        const event = new Event('click');
        component.onEdit(event);
    });

    it('should emit delete event when delete button is clicked', (done) => {
        component.delete.subscribe((id) => {
            expect(id).toBe('1');
            done();
        });
        const event = new Event('click');
        component.onDelete(event);
    });

    it('should calculate total time correctly', () => {
        expect(component.getTotalTime()).toBe(45);
    });
});
