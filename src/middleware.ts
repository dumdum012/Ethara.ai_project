import { defineMiddleware } from 'astro:middleware';
import { verifyToken } from './lib/auth';

export const onRequest = defineMiddleware((context, next) => {
  const token = context.cookies.get('token')?.value;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      context.locals.user = {
        id: decoded.id,
        role: decoded.role
      };
    }
  }

  return next();
});
