import { Component } from '@angular/core';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
    selector: 'app-form-page',
    standalone: true,
    imports: [RecipeFormComponent],
    template: '<app-recipe-form></app-recipe-form>',
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class FormPageComponent { }
