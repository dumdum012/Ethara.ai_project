import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  const cookieString = `token=deleted; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; ${secure}`;

  return new Response(JSON.stringify({ success: true }), { 
    status: 200,
    headers: {
      'Set-Cookie': cookieString,
      'Content-Type': 'application/json'
    }
  });
}
