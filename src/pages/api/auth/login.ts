import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const token = signToken({ id: user.id, role: user.role });
    
    cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return new Response(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
  }
}
