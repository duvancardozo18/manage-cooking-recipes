import { Component } from '@angular/core';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';

@Component({
    selector: 'app-list-page',
    standalone: true,
    imports: [RecipeListComponent],
    template: '<app-recipe-list></app-recipe-list>',
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class ListPageComponent { }
