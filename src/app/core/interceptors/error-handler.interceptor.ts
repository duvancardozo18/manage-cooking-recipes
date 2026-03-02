import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const startTime = Date.now();
    const isExternalApi = req.url.startsWith('http://') || req.url.startsWith('https://');

    return next(req).pipe(
        tap(event => {
            const duration = Date.now() - startTime;
            if (!isExternalApi) {
                console.log(`[HTTP Success] ${req.method} ${req.url}`, {
                    duration: `${duration}ms`,
                    status: 'success'
                });
            }
        }),

        catchError((error: HttpErrorResponse) => {
            const duration = Date.now() - startTime;
            let errorMessage = 'Ocurrió un error desconocido';

            if (error.error instanceof ErrorEvent) {
                errorMessage = `Error de red: ${error.error.message}`;
                console.error('[HTTP Client Error]', {
                    url: req.url,
                    method: req.method,
                    message: error.error.message,
                    duration: `${duration}ms`
                });
            } else {
                switch (error.status) {
                    case 400:
                        errorMessage = 'Solicitud incorrecta. Por favor verifica los datos enviados.';
                        break;
                    case 401:
                        errorMessage = 'No autorizado. Por favor inicia sesión.';
                        console.warn('[HTTP 401] No autorizado - Redirigir a login si es necesario');
                        break;
                    case 403:
                        errorMessage = 'Acceso prohibido. No tienes permisos para esta acción.';
                        break;
                    case 404:
                        errorMessage = 'Recurso no encontrado.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Intenta más tarde.';
                        break;
                    case 503:
                        errorMessage = 'Servicio no disponible. Intenta más tarde.';
                        break;
                    default:
                        errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
                }

                console.error('[HTTP Server Error]', {
                    url: req.url,
                    method: req.method,
                    status: error.status,
                    message: errorMessage,
                    error: error.error,
                    duration: `${duration}ms`
                });
            }
            return throwError(() => ({
                originalError: error,
                message: errorMessage,
                status: error.status,
                timestamp: new Date(),
                url: req.url
            }));
        })
    );
};
