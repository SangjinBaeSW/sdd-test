import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import type { ApiError } from '@project-board/shared';
import { ERROR_MESSAGES } from '@project-board/shared';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  let statusCode = 500;
  let error: ApiError = {
    code: 'INTERNAL_ERROR',
    message: ERROR_MESSAGES.INTERNAL_ERROR,
  };

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    error = {
      code: err.code,
      message: err.message,
      details: err.details,
    };
  } else if (err instanceof ZodError) {
    statusCode = 400;
    error = {
      code: 'VALIDATION_ERROR',
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      details: { errors: err.errors },
    };
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      statusCode = 404;
      error = {
        code: 'NOT_FOUND',
        message: ERROR_MESSAGES.NOT_FOUND,
      };
    } else if (err.code === 'P2002') {
      statusCode = 409;
      error = {
        code: 'DUPLICATE_ERROR',
        message: ERROR_MESSAGES.DUPLICATE_ERROR,
      };
    }
  }

  res.status(statusCode).json({
    success: false,
    error,
  });
}
