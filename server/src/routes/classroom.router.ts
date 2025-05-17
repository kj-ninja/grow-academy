import { Router } from "express";
import { checkOwner } from "utils";
import {
  // Core classroom controllers
  deleteClassroom,
  getClassroom,
  getClassrooms,
  validateClassroomName,
  validateClassroomHandle,
} from "controllers/classroom.controller";

import {
  // Membership management controllers
  createClassroomMembership,
  cancelClassroomMembershipRequest,
  deleteClassroomMembership,
  approveClassroomMembershipRequest,
  rejectClassroomMembershipRequest,
  getClassroomPendingRequests,
  removeClassroomMember,
} from "controllers/classroom-membership.controller";

import { upload } from "middlewares/upload/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "controllers/resource.controller";
import {
  enhancedAuth,
  withEnhancedAuth,
  withEnhancedAuthMiddleware,
} from "middlewares/auth/enhancedAuth";
import {
  handleCreateClassroom,
  handleUpdateClassroom,
  withAuth,
} from "./middleware/classroom.middleware";

const router = Router();

// Validation endpoints
router.get("/validate/:classroomName", withAuth, withEnhancedAuth(validateClassroomName));
router.get("/validate/:handle", withAuth, withEnhancedAuth(validateClassroomHandle));

// Core classroom CRUD
router.get("/", withAuth, withEnhancedAuth(getClassrooms));
router.get("/:id", withAuth, withEnhancedAuth(getClassroom));
router.post("/", handleCreateClassroom); // Single middleware instead of 4
router.patch("/:id", handleUpdateClassroom); // Single middleware instead of 5
router.delete("/:id", withAuth, withEnhancedAuth(deleteClassroom));

// todo: add compose middleware for classroom memberships
// Membership management
router.post("/:id/memberships", withAuth, withEnhancedAuth(createClassroomMembership));
router.delete(
  "/:id/memberships/requests",
  withAuth,
  withEnhancedAuth(cancelClassroomMembershipRequest)
);
router.delete("/:id/memberships", withAuth, withEnhancedAuth(deleteClassroomMembership));

// Membership request management (admin)
router.get(
  "/:id/memberships/requests",
  withAuth,
  withEnhancedAuthMiddleware(checkOwner),
  withEnhancedAuth(getClassroomPendingRequests)
);
router.patch(
  "/:id/memberships/requests/:userId/approve",
  withAuth,
  withEnhancedAuthMiddleware(checkOwner),
  withEnhancedAuth(approveClassroomMembershipRequest)
);
router.patch(
  "/:id/memberships/requests/:userId/reject",
  withAuth,
  withEnhancedAuthMiddleware(checkOwner),
  withEnhancedAuth(rejectClassroomMembershipRequest)
);
router.delete(
  "/:id/memberships/:userId",
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner),
  withEnhancedAuth(removeClassroomMember)
);

// Resources todo...
router.get("/:id/resources", getResources);
router.post(
  "/:id/resources",
  withAuth,
  upload.single("file"),
  withEnhancedAuth(uploadResource)
);
router.get("/resources/:id/download", downloadResource);
router.delete("/resources/:id", withAuth, withEnhancedAuth(deleteResource));

export default router;
