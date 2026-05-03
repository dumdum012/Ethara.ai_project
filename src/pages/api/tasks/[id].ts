import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = params;
    const { status } = await request.json();

    const existingTask = await prisma.task.findUnique({ where: { id: id as string } });
    if (!existingTask) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }

    if (existingTask.assigneeId !== locals.user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only the assignee can update task status' }), { status: 403 });
    }

    const task = await prisma.task.update({
      where: { id: id as string },
      data: { status }
    });

    return new Response(JSON.stringify({ task }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only Admins can delete tasks' }), { status: 403 });
  }

  try {
    const { id } = params;

    await prisma.task.delete({
      where: { id: id as string }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
  }
};
