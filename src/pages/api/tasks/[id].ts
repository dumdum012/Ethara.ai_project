import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = params;
    const { status } = await request.json();

    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });

    return new Response(JSON.stringify({ task }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
  }
};
