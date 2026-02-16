import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeApplicationService } from '../../application/services/recipe-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Recipe } from '../../domain/entities/recipe.entity';
import { RecipeName } from '../../domain/value-objects/recipe-name.value-object';
import { CookingTime } from '../../domain/value-objects/cooking-time.value-object';
import { Servings } from '../../domain/value-objects/servings.value-object';
import { Difficulty } from '../../domain/value-objects/difficulty.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

describe('RecipeDetailComponent', () => {
    let component: RecipeDetailComponent;
    let fixture: ComponentFixture<RecipeDetailComponent>;
    let mockRecipeService: any;
    let mockRouter: any;
    let mockActivatedRoute: any;

    const mockRecipe = new Recipe(
        '1',
        RecipeName.create('Pasta Carbonara'),
        'Italian pasta with eggs and bacon',
        ['Pasta', 'Eggs', 'Bacon'],
        ['Boil pasta', 'Fry bacon', 'Mix'],
        CookingTime.create(15),
        CookingTime.create(20),
        Servings.create(4),
        Difficulty.create('medium'),
        Category.create('Pasta'),
        'https://example.com/image.jpg',
        new Date(),
        new Date()
    );

    beforeEach(async () => {
        const recipeUpdatedSubject = new Subject<Recipe>();
        const recipeDeletedSubject = new Subject<string>();

        mockRecipeService = {
            getRecipeById: jest.fn().mockReturnValue(mockRecipe),
            deleteRecipe: jest.fn().mockReturnValue(true),
            recipeUpdated$: recipeUpdatedSubject.asObservable(),
            recipeDeleted$: recipeDeletedSubject.asObservable(),
        };

        mockRouter = {
            navigate: jest.fn(),
        };

        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: jest.fn().mockReturnValue('1'),
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [RecipeDetailComponent],
            providers: [
                { provide: RecipeApplicationService, useValue: mockRecipeService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RecipeDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should load recipe by id from route', () => {
            expect(mockRecipeService.getRecipeById).toHaveBeenCalledWith('1');
            expect(component.recipe()).toBeDefined();
            expect(component.recipe()?.id).toBe('1');
        });

        it('should navigate to recipes if recipe not found', () => {
            mockRecipeService.getRecipeById.mockReturnValue(null);
            mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('999');

            const newComponent = new RecipeDetailComponent(
                mockActivatedRoute,
                mockRouter,
                mockRecipeService
            );
            newComponent.ngOnInit();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
        });

        it('should not load recipe if no id in route', () => {
            mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);
            const newComponent = new RecipeDetailComponent(
                mockActivatedRoute,
                mockRouter,
                mockRecipeService
            );
            newComponent.ngOnInit();

            expect(newComponent.recipe()).toBeUndefined();
        });
    });

    describe('deleteRecipe', () => {
        it('should delete recipe when confirmed', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(true);

            component.deleteRecipe();

            expect(mockRecipeService.deleteRecipe).toHaveBeenCalledWith('1');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
        });

        it('should not delete recipe when cancelled', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(false);

            component.deleteRecipe();

            expect(mockRecipeService.deleteRecipe).not.toHaveBeenCalled();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it('should not delete if recipe is undefined', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(true);
            component.recipe.set(undefined);

            component.deleteRecipe();

            expect(mockRecipeService.deleteRecipe).not.toHaveBeenCalled();
        });
    });

    describe('getTotalTime', () => {
        it('should return total cooking time', () => {
            const totalTime = component.getTotalTime();
            expect(totalTime).toBe(35); // 15 + 20
        });

        it('should return 0 if recipe is undefined', () => {
            component.recipe.set(undefined);
            const totalTime = component.getTotalTime();
            expect(totalTime).toBe(0);
        });
    });

    describe('getDifficultyColor', () => {
        it('should return difficulty color for recipe', () => {
            const color = component.getDifficultyColor('medium');
            expect(typeof color).toBe('string');
        });

        it('should return default color if recipe is undefined', () => {
            component.recipe.set(undefined);
            const color = component.getDifficultyColor('medium');
            expect(color).toBe('#6b7280');
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from all subscriptions', () => {
            const unsubscribeSpy = jest.spyOn(component['subscriptions'], 'unsubscribe');
            component.ngOnDestroy();
            expect(unsubscribeSpy).toHaveBeenCalled();
        });
    });
});
