import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authHeaderInterceptor } from './core/interceptors/auth-header.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), 
      withViewTransitions() 
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authHeaderInterceptor,    
        errorHandlerInterceptor   
      ])
    )
  ]
};
