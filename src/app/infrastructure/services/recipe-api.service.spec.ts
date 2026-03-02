import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeApiService } from './recipe-api.service';

describe('RecipeApiService', () => {
    let service: RecipeApiService;
    let httpMock: HttpTestingController;
    const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RecipeApiService]
        });
        service = TestBed.inject(RecipeApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get recipes by category', (done) => {
        const mockResponse = {
            meals: [
                { idMeal: '1', strMeal: 'Test Recipe 1' },
                { idMeal: '2', strMeal: 'Test Recipe 2' }
            ]
        };

        service.getRecipesByCategory('Beef').subscribe(recipes => {
            expect(recipes.length).toBe(2);
            expect(recipes[0].strMeal).toBe('Test Recipe 1');
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/filter.php?c=Beef`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get recipe by id', (done) => {
        const mockResponse = {
            meals: [
                { idMeal: '123', strMeal: 'Test Recipe', strInstructions: 'Test instructions' }
            ]
        };

        service.getRecipeById('123').subscribe(recipe => {
            expect(recipe).toBeTruthy();
            expect(recipe.idMeal).toBe('123');
            expect(recipe.strMeal).toBe('Test Recipe');
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/lookup.php?i=123`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should search recipes by name', (done) => {
        const mockResponse = {
            meals: [
                { idMeal: '1', strMeal: 'Chicken Curry' }
            ]
        };

        service.searchRecipesByName('Chicken').subscribe(recipes => {
            expect(recipes.length).toBe(1);
            expect(recipes[0].strMeal).toBe('Chicken Curry');
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/search.php?s=Chicken`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should handle errors gracefully', (done) => {
        service.getRecipesByCategory('Invalid').subscribe(recipes => {
            expect(recipes).toEqual([]);
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/filter.php?c=Invalid`);
        req.error(new ProgressEvent('error'));
    });

    it('should get all categories', (done) => {
        const mockResponse = {
            categories: [
                { idCategory: '1', strCategory: 'Beef' },
                { idCategory: '2', strCategory: 'Chicken' }
            ]
        };

        service.getAllCategories().subscribe(categories => {
            expect(categories.length).toBe(2);
            expect(categories[0].strCategory).toBe('Beef');
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/categories.php`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get random recipe', (done) => {
        const mockResponse = {
            meals: [
                { idMeal: '999', strMeal: 'Random Recipe' }
            ]
        };

        service.getRandomRecipe().subscribe(recipe => {
            expect(recipe).toBeTruthy();
            expect(recipe.idMeal).toBe('999');
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/random.php`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get recipes by ingredient', (done) => {
        const mockResponse = {
            meals: [
                { idMeal: '1', strMeal: 'Chicken Soup' }
            ]
        };

        service.getRecipesByIngredient('chicken').subscribe(recipes => {
            expect(recipes.length).toBe(1);
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/filter.php?i=chicken`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get recipes by area', (done) => {
        const mockResponse = {
            meals: [
                { idMeal: '1', strMeal: 'Pasta Carbonara' }
            ]
        };

        service.getRecipesByArea('Italian').subscribe(recipes => {
            expect(recipes.length).toBe(1);
            done();
        });

        const req = httpMock.expectOne(`${API_BASE_URL}/filter.php?a=Italian`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});
