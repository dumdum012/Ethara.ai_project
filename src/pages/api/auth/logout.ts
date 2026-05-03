import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('token', { 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
