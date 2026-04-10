import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { getRequest } from '$lib/api/client';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const adminRoutes = ['/admin'];

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('accessToken');
  const pathname = event.url.pathname;

  const isPublic = publicRoutes.includes(pathname);
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r));

  if (!isPublic && !token) {
    redirect(303, '/login');
  }

  if (isPublic && token) {
    redirect(303, '/search');
  }

  if (token) {
    event.locals.token = token;

    if (isAdmin) {
      try {
        const user = await getRequest<{ role: string }>('/auth/me', token);
        if (user.role !== 'admin') {
          redirect(303, '/search');
        }
      } catch {
        redirect(303, '/login');
      }
    }
  }

  return resolve(event);
};