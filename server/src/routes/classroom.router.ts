import { authenticateJWT } from "middlewares/authenticateJWT";
import { Router } from "express";
import { checkOwner } from "utils";
import {
  // Core classroom controllers
  createClassroom,
  updateClassroom,
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

import { uploadMultiple, upload } from "middlewares/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "@controllers/resource.controller";

const router = Router();

// Validation endpoints
router.get(
  "/check-name/:classroomName",
  authenticateJWT,
  validateClassroomName,
);
router.get("/check-handle/:handle", authenticateJWT, validateClassroomHandle);

// Core classroom CRUD
router.get("/", authenticateJWT, getClassrooms);
router.get("/:id", authenticateJWT, getClassroom);
router.post("/", authenticateJWT, uploadMultiple, createClassroom);
router.patch(
  "/:id",
  authenticateJWT,
  checkOwner,
  uploadMultiple,
  updateClassroom,
);
router.delete("/:id", authenticateJWT, deleteClassroom);

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
  authenticateJWT,
  checkOwner,
  getClassroomPendingRequests,
);
router.patch(
  "/:id/memberships/requests/:userId/approve",
  authenticateJWT,
  checkOwner,
  approveClassroomMembershipRequest,
);
router.patch(
  "/:id/memberships/requests/:userId/reject",
  authenticateJWT,
  checkOwner,
  rejectClassroomMembershipRequest,
);
router.delete(
  "/:id/memberships/:userId",
  authenticateJWT,
  checkOwner,
  removeClassroomMember,
);

// Resources
router.get("/:id/resources", authenticateJWT, getResources);
router.post(
  "/:id/resources",
  authenticateJWT,
  upload.single("file"),
  uploadResource,
);
router.get("/resources/:id/download", authenticateJWT, downloadResource);
router.delete("/resources/:id", authenticateJWT, deleteResource);

export default router;
