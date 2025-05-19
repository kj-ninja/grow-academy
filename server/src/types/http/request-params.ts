/**
 * URL parameter types for route handlers
 * These are the validated parameter types that come from URL path or query string
 */

/**
 * Parameter with classroom ID
 */
export interface ClassroomIdParam {
  id: number;
}

/**
 * Parameters with both classroom and user IDs
 */
export interface ClassroomUserParams {
  id: number;
  userId: number;
}

/**
 * Resource ID parameter
 */
export interface ResourceIdParam {
  id: number;
}
