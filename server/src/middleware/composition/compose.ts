import type { RequestHandler, Request, Response, NextFunction } from "express";

/**
 * Composes multiple middleware functions into a single middleware function
 *
 * This function follows the Middleware Composition Pattern, which:
 * - Improves readability by grouping related middleware
 * - Enhances reusability of middleware combinations
 * - Makes routes more declarative by expressing intent
 * - Simplifies complex middleware chains
 *
 * @param middlewares - Array of middleware functions to compose
 * @returns A single middleware function that executes all middlewares in sequence
 */
export function compose(...middlewares: RequestHandler[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Execute each middleware in sequence
    const executeMiddleware = (index: number): void => {
      // If we've run all middleware, call the final 'next'
      if (index === middlewares.length) {
        return next();
      }

      const currentMiddleware = middlewares[index];

      try {
        // Execute current middleware with a custom next function
        // that will either call the next middleware or handle errors
        currentMiddleware(req, res, (err) => {
          if (err) {
            // If there's an error, skip remaining middleware
            return next(err);
          }
          // Otherwise proceed to next middleware
          executeMiddleware(index + 1);
        });
      } catch (err) {
        next(err);
      }
    };

    // Start execution from the first middleware
    executeMiddleware(0);
  };
}
