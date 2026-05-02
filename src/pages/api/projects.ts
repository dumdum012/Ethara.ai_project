import type { APIRoute } from 'astro';
import { prisma } from '../../lib/prisma';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    let projects;
    if (locals.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: { members: { include: { user: true } } }
      });
    } else {
      projects = await prisma.project.findMany({
        where: { members: { some: { userId: locals.user.id } } },
        include: { members: { include: { user: true } } }
      });
    }

    return new Response(JSON.stringify({ projects }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const { name, description, memberIds } = await request.json();

    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: (memberIds || []).map((id: string) => ({ userId: id }))
        }
      }
    });

    return new Response(JSON.stringify({ project }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create project' }), { status: 500 });
  }
};
