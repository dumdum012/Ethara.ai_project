import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { name, email, password, role } = await request.json();
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const validRole = role === 'ADMIN' ? 'ADMIN' : 'MEMBER';

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: validRole }
    });

    const token = signToken({ id: user.id, role: user.role });
    
    cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return new Response(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }), { status: 200 });
  } catch (error) {
    console.error('Registration Error:', error);
    return new Response(JSON.stringify({ error: 'Registration failed', details: String(error) }), { status: 500 });
  }
}
