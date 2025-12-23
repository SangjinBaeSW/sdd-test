import { PrismaClient, User } from '@prisma/client';
import { AUTH_ERRORS } from '@project-board/shared';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Remove password from user object
 */
function toSafeUser(user: User): SafeUser {
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  name?: string
): Promise<{ user: SafeUser; token: string }> {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('EMAIL_EXISTS', AUTH_ERRORS.EMAIL_EXISTS, 400);
  }

  // Validate password length
  if (password.length < 8) {
    throw new AppError('PASSWORD_TOO_SHORT', AUTH_ERRORS.PASSWORD_TOO_SHORT, 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  });

  // Generate token
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: toSafeUser(user), token };
}

/**
 * Login a user
 */
export async function login(
  email: string,
  password: string
): Promise<{ user: SafeUser; token: string }> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', AUTH_ERRORS.INVALID_CREDENTIALS, 401);
  }

  // Check password
  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new AppError('INVALID_CREDENTIALS', AUTH_ERRORS.INVALID_CREDENTIALS, 401);
  }

  // Generate token
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: toSafeUser(user), token };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user ? toSafeUser(user) : null;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user ? toSafeUser(user) : null;
}
