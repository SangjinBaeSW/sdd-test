import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AUTH_ERRORS } from '@project-board/shared';
import { register, login, getUserById } from '../services/authService.js';
import { requireAuth } from '../middleware/auth.js';
import { env } from '../config/env.js';

export const authRouter = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(AUTH_ERRORS.INVALID_EMAIL),
  password: z.string().min(8, AUTH_ERRORS.PASSWORD_TOO_SHORT),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(AUTH_ERRORS.INVALID_EMAIL),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
};

// Async handler wrapper
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// POST /api/auth/register - Register a new user
authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const { user, token } = await register(data.email, data.password, data.name);

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      data: { user },
    });
  })
);

// POST /api/auth/login - Login a user
authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const { user, token } = await login(data.email, data.password);

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      data: { user },
    });
  })
);

// POST /api/auth/logout - Logout a user
authRouter.post('/logout', (req, res) => {
  // Clear cookie
  res.cookie('token', '', {
    ...cookieOptions,
    maxAge: 0,
  });

  res.json({
    success: true,
    message: AUTH_ERRORS.LOGOUT_SUCCESS,
  });
});

// GET /api/auth/me - Get current user
authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.user!.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  })
);
