import type { APIRoute } from 'astro';
import { prisma } from '../../lib/prisma';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    let tasks;
    if (locals.user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({ include: { assignee: true } });
    } else {
      tasks = await prisma.task.findMany({
        where: { assigneeId: locals.user.id },
        include: { assignee: true }
      });
    }

    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only Admins can create tasks' }), { status: 403 });
  }

  try {
    const { title, description, dueDate, assigneeId } = await request.json();

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId
      }
    });

    return new Response(JSON.stringify({ task }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create task' }), { status: 500 });
  }
};
