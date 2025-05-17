import { compose } from "utils/middleware/compose";
import {
  enhancedAuth,
  withEnhancedAuth,
  withEnhancedAuthMiddleware,
} from "middlewares/auth/enhancedAuth";
import { validateRequest } from "middlewares/validation/validateRequest";
import {
  createClassroomSchema,
  updateClassroomSchema,
} from "validations/schemas/classroom.schema";
import { uploadMultiple } from "middlewares/upload/uploadMiddleware";
import { checkOwner } from "utils/middleware/authorization";
import {
  createClassroom,
  updateClassroom,
} from "@controllers/classroom.controller";

/**
 * Authentication middleware for routes requiring enhanced authentication
 */
export const withAuth = compose(enhancedAuth);

/**
 * Middleware chain for classroom creation:
 * 1. Authenticates the user
 * 2. Handles file uploads
 * 3. Validates request body
 * 4. Uses enhancedAuth wrapper for controller
 */
export const createClassroomMiddleware = compose(
  enhancedAuth,
  uploadMultiple,
  validateRequest(createClassroomSchema),
);

/**
 * Middleware chain for classroom updates:
 * 1. Authenticates the user
 * 2. Verifies the user is the classroom owner
 * 3. Handles file uploads
 * 4. Validates request body
 */
export const updateClassroomMiddleware = compose(
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner),
  uploadMultiple,
  validateRequest(updateClassroomSchema),
);

/**
 * Complete route handler for creating a classroom
 */
export const handleCreateClassroom = compose(
  createClassroomMiddleware,
  withEnhancedAuth(createClassroom),
);

/**
 * Complete route handler for updating a classroom
 */
export const handleUpdateClassroom = compose(
  updateClassroomMiddleware,
  withEnhancedAuth(updateClassroom),
);
