import type { APIRoute } from 'astro';
import { prisma } from '../../lib/prisma';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    let tasks;
    if (locals.user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({ include: { project: true, assignee: true } });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assigneeId: locals.user.id },
            { project: { members: { some: { userId: locals.user.id } } } }
          ]
        },
        include: { project: true, assignee: true }
      });
    }

    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { title, description, dueDate, projectId, assigneeId } = await request.json();

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId
      }
    });

    return new Response(JSON.stringify({ task }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create task' }), { status: 500 });
  }
};
