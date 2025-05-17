export class ApplicationError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string = "Validation failed", details?: any) {
    super(message, 400, details);
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string = "Not authorized") {
    super(message, 403);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(entity: string) {
    super(`${entity} not found`, 404);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = "Resource already exists", details?: any) {
    super(message, 409, details);
  }
}
