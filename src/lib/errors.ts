import { NextResponse } from 'next/server';
import { ApiError } from '@/types/api';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, _field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ExternalApiError extends AppError {
  constructor(service: string, message: string) {
    super(`External API error (${service}): ${message}`, 502, 'EXTERNAL_API_ERROR');
    this.name = 'ExternalApiError';
  }
}

export function handleApiError(error: unknown): NextResponse<ApiError> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.code && { code: error.code })
      },
      { status: error.statusCode }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function validateEnvironment(): void {
  const requiredEnvVars = ['TMDB_ACCESS_TOKEN', 'DATABASE_URL', 'CLERK_SECRET_KEY'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new AppError(`${envVar} is not set`, 500, 'MISSING_ENV_VAR');
    }
  }
}
