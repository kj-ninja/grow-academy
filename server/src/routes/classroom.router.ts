import { Router } from "express";
import {
  deleteClassroom,
  getClassroom,
  getClassrooms,
  validateClassroomName,
  validateClassroomHandle,
} from "controllers/classroom.controller";

import {
  handleCreateMembership,
  handleCancelMembershipRequest,
  handleDeleteMembership,
  handleApproveMembership,
  handleRejectMembership,
  handleGetPendingRequests,
  handleRemoveMember,
} from "../middlewares/domain/classroomMembership";

import { upload } from "middlewares/upload/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "controllers/resource.controller";
import { withEnhancedAuth } from "middlewares/auth/enhancedAuth";
import {
  handleCreateClassroom,
  handleUpdateClassroom,
  withAuth,
} from "../middlewares/domain/classroom";
import { validateParams } from "../middlewares/validation/validateParams";

const router = Router();

// Validation endpoints
router.get("/validate/:classroomName", withAuth, withEnhancedAuth(validateClassroomName));
router.get("/validate/:handle", withAuth, withEnhancedAuth(validateClassroomHandle));

// Core classroom CRUD
router.get("/", withAuth, withEnhancedAuth(getClassrooms));
router.get("/:id", validateParams(["id"]), withAuth, withEnhancedAuth(getClassroom));
router.post("/", handleCreateClassroom); // Single middleware instead of 4
router.patch("/:id", validateParams(["id"]), handleUpdateClassroom); // Single middleware instead of 5
router.delete(
  "/:id",
  validateParams(["id"]),
  withAuth,
  withEnhancedAuth(deleteClassroom)
);

// Membership management - updated to use composed handlers
router.post("/:id/memberships", handleCreateMembership);
router.delete("/:id/memberships/requests", handleCancelMembershipRequest);
router.delete("/:id/memberships", handleDeleteMembership);

// Membership request management (admin) - updated to use composed handlers
router.get("/:id/memberships/requests", handleGetPendingRequests);
router.patch("/:id/memberships/requests/:userId/approve", handleApproveMembership);
router.patch("/:id/memberships/requests/:userId/reject", handleRejectMembership);
router.delete("/:id/memberships/:userId", handleRemoveMember);

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
