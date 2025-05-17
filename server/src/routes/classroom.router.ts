import { authenticateJWT } from "middlewares/auth/authenticateJWT";
import { Router } from "express";
import { checkOwner } from "utils";
import {
  // Core classroom controllers
  deleteClassroom,
  getClassroom,
  getClassrooms,
  validateClassroomName,
  validateClassroomHandle,
} from "@controllers/classroom.controller";

import {
  // Membership management controllers
  createClassroomMembership,
  cancelClassroomMembershipRequest,
  deleteClassroomMembership,
  approveClassroomMembershipRequest,
  rejectClassroomMembershipRequest,
  getClassroomPendingRequests,
  removeClassroomMember,
} from "@controllers/classroom-membership.controller";

import { upload } from "middlewares/upload/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "@controllers/resource.controller";
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
router.get(
  "/check-name/:classroomName",
  withAuth,
  withEnhancedAuth(validateClassroomName),
);
router.get(
  "/check-handle/:handle",
  withAuth,
  withEnhancedAuth(validateClassroomHandle),
);

// Core classroom CRUD
router.get("/", withAuth, withEnhancedAuth(getClassrooms));
router.get("/:id", withAuth, withEnhancedAuth(getClassroom));
router.post("/", handleCreateClassroom); // Single middleware instead of 4
router.patch("/:id", handleUpdateClassroom); // Single middleware instead of 5
router.delete("/:id", withAuth, withEnhancedAuth(deleteClassroom));

// Membership management
router.post("/:id/memberships", authenticateJWT, createClassroomMembership);
router.delete(
  "/:id/memberships/requests",
  authenticateJWT,
  cancelClassroomMembershipRequest,
);
router.delete("/:id/memberships", authenticateJWT, deleteClassroomMembership);

// Membership request management (admin)
router.get(
  "/:id/memberships/requests",
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner),
  getClassroomPendingRequests,
);
router.patch(
  "/:id/memberships/requests/:userId/approve",
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner),
  approveClassroomMembershipRequest,
);
router.patch(
  "/:id/memberships/requests/:userId/reject",
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner),
  rejectClassroomMembershipRequest,
);
router.delete(
  "/:id/memberships/:userId",
  enhancedAuth,
  withEnhancedAuthMiddleware(checkOwner),
  removeClassroomMember,
);

// Resources
router.get("/:id/resources", authenticateJWT, getResources);
router.post(
  "/:id/resources",
  enhancedAuth,
  upload.single("file"),
  uploadResource,
);
router.get("/resources/:id/download", enhancedAuth, downloadResource);
router.delete("/resources/:id", enhancedAuth, deleteResource);

export default router;
