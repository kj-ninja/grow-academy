import { checkOwner } from "../auth/permissions";
import {
  createClassroomMembership,
  approveClassroomMembershipRequest,
  rejectClassroomMembershipRequest,
  removeClassroomMember,
  cancelClassroomMembershipRequest,
  deleteClassroomMembership,
  getClassroomPendingRequests,
} from "controllers/classroom-membership.controller";
import { compose } from "../composition/compose";
import { validateParams } from "../validation/validateParams";
import {
  enhancedAuth,
  withEnhancedAuth,
  withEnhancedAuthMiddleware,
} from "../auth/enhancedAuth";

/**
 * Middleware chain for basic membership operations
 * Using spread operator (...) to unpack the array of validators
 * into individual arguments for compose
 */
export const basicMembershipMiddleware = compose(...validateParams(["id"]), enhancedAuth);

/**
 * Middleware chain for membership operations requiring user ID
 * Extends basic middleware with userId parameter validation
 */
export const userMembershipMiddleware = compose(
  ...validateParams(["id", "userId"]),
  enhancedAuth
);

/**
 * Middleware chain for admin membership operations
 * Adds owner permission check on top of basic middleware
 */
export const adminMembershipMiddleware = compose(
  ...validateParams(["id"]),
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner)
);

/**
 * Middleware chain for admin operations on specific members
 * Validates both classroom ID and user ID, plus owner permissions
 */
export const adminUserMembershipMiddleware = compose(
  ...validateParams(["id", "userId"]),
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner)
);

/**
 * Complete route handlers for membership management
 */
export const handleCreateMembership = compose(
  basicMembershipMiddleware,
  withEnhancedAuth(createClassroomMembership)
);

export const handleCancelMembershipRequest = compose(
  basicMembershipMiddleware,
  withEnhancedAuth(cancelClassroomMembershipRequest)
);

export const handleDeleteMembership = compose(
  basicMembershipMiddleware,
  withEnhancedAuth(deleteClassroomMembership)
);

export const handleGetPendingRequests = compose(
  adminMembershipMiddleware,
  withEnhancedAuth(getClassroomPendingRequests)
);

export const handleApproveMembership = compose(
  adminUserMembershipMiddleware,
  withEnhancedAuth(approveClassroomMembershipRequest)
);

export const handleRejectMembership = compose(
  adminUserMembershipMiddleware,
  withEnhancedAuth(rejectClassroomMembershipRequest)
);

export const handleRemoveMember = compose(
  adminUserMembershipMiddleware,
  withEnhancedAuth(removeClassroomMember)
);
