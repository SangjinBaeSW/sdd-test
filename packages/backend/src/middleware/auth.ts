import { Request, Response, NextFunction } from 'express';
import { AUTH_ERRORS } from '@project-board/shared';
import { verifyToken, TokenPayload } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware that requires authentication
 * Returns 401 if no valid token is provided
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError('UNAUTHORIZED', AUTH_ERRORS.UNAUTHORIZED, 401);
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError('TOKEN_EXPIRED', AUTH_ERRORS.TOKEN_EXPIRED, 401));
    } else if (error instanceof JsonWebTokenError) {
      next(new AppError('TOKEN_INVALID', AUTH_ERRORS.TOKEN_INVALID, 401));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('UNAUTHORIZED', AUTH_ERRORS.UNAUTHORIZED, 401));
    }
  }
}

/**
 * Middleware that optionally authenticates
 * Sets req.user if valid token is provided, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.token;

    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }
    next();
  } catch {
    // Token is invalid or expired, but we don't require auth
    // Just continue without setting req.user
    next();
  }
}
