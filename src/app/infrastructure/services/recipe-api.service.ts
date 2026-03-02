import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class RecipeApiService {
    private readonly API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
    private http = inject(HttpClient);

    getRecipesByCategory(category: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/filter.php?c=${category}`).pipe(
            map((response: any) => response.meals || []),
            catchError(error => {
                console.error(`Error fetching recipes for category ${category}:`, error);
                return of([]);
            })
        );
    }

    getRecipeById(id: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/lookup.php?i=${id}`).pipe(
            map((response: any) => response.meals?.[0] || null),
            catchError(error => {
                console.error(`Error fetching recipe details for ID ${id}:`, error);
                return of(null);
            })
        );
    }

    searchRecipesByName(searchTerm: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/search.php?s=${searchTerm}`).pipe(
            map((response: any) => response.meals || []),
            catchError(error => {
                console.error(`Error searching recipes with term ${searchTerm}:`, error);
                return of([]);
            })
        );
    }

    getAllCategories(): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/categories.php`).pipe(
            map((response: any) => response.categories || []),
            catchError(error => {
                console.error('Error fetching categories:', error);
                return of([]);
            })
        );
    }

    getRandomRecipe(): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/random.php`).pipe(
            map((response: any) => response.meals?.[0] || null),
            catchError(error => {
                console.error('Error fetching random recipe:', error);
                return of(null);
            })
        );
    }
    getRecipesByIngredient(ingredient: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/filter.php?i=${ingredient}`).pipe(
            map((response: any) => response.meals || []),
            catchError(error => {
                console.error(`Error fetching recipes with ingredient ${ingredient}:`, error);
                return of([]);
            })
        );
    }

    getRecipesByArea(area: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/filter.php?a=${area}`).pipe(
            map((response: any) => response.meals || []),
            catchError(error => {
                console.error(`Error fetching recipes for area ${area}:`, error);
                return of([]);
            })
        );
    }
}
