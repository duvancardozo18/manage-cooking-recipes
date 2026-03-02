import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // Permite binding de parámetros de ruta a inputs
      withViewTransitions() // Habilita transiciones suaves entre vistas
    ),
    provideHttpClient(withFetch())
  ]
};
