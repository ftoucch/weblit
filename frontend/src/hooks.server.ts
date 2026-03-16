import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('accessToken');
  const pathname = event.url.pathname;

  const isPublic = publicRoutes.includes(pathname);
  if (!isPublic && !token) {
    redirect(303, '/auth/login');
  }

  if (isPublic && token) {
    redirect(303, '/');
  }

  if (token) {
    event.locals.token = token;
  }

  return resolve(event);
};
