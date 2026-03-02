import { HttpInterceptorFn } from '@angular/common/http';

export const authHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const token = localStorage.getItem('auth_token');
    const modifiedReq = req.clone({
        setHeaders: {
            'X-App-Version': '1.0.0',
            'X-Request-ID': requestId,
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });

    console.log(`[HTTP Interceptor] Request ID: ${requestId}`, {
        method: modifiedReq.method,
        url: modifiedReq.url,
        headers: modifiedReq.headers.keys()
    });

    return next(modifiedReq);
};
