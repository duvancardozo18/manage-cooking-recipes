import { CanActivateFn, CanDeactivateFn } from '@angular/router';

export const routeLoggingGuard: CanActivateFn = (route, state) => {
    const routePath = state.url;
    console.log(` Entrando a la ruta: ${routePath}`);
    return true;
};

export const routeExitLoggingGuard: CanDeactivateFn<unknown> = (
    component,
    currentRoute,
    currentState,
    nextState
) => {
    const currentPath = currentState?.url || 'unknown';
    const nextPath = nextState?.url || 'unknown';
    console.log(` Saliendo de la ruta: ${currentPath} → ${nextPath}`);
    return true;
};
