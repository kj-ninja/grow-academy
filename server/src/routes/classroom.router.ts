import { authenticateJWT } from "@middleware/authenticateJWT";
import { Router } from "express";
import { checkOwner } from "utils";
import {
  approveJoinRequest,
  cancelJoinRequest,
  checkClassroomHandle,
  checkClassroomName,
  createClassroom,
  deleteClassroom,
  getClassroomDetails,
  getClassrooms,
  joinRequest,
  rejectJoinRequest,
  removeMember,
  viewPendingRequests,
  leaveClassroomController,
} from "@controllers/classroom.controller";
import { upload, uploadMultiple } from "@middleware/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "@controllers/resource.controller";

const router = Router();

router.get("/check-name/:classroomName", authenticateJWT, checkClassroomName);
router.get("/check-handle/:handle", authenticateJWT, checkClassroomHandle);

router.get("/", authenticateJWT, getClassrooms);
router.get("/:handle/", authenticateJWT, getClassroomDetails);

router.post("/", authenticateJWT, uploadMultiple, createClassroom);
router.delete("/:id", authenticateJWT, deleteClassroom);

router.post("/:id/join", authenticateJWT, joinRequest);
router.delete("/:id/join-cancel", authenticateJWT, cancelJoinRequest);
router.post("/:id/leave", authenticateJWT, leaveClassroomController);
router.patch(
  "/:id/requests/:userId/approve",
  authenticateJWT,
  checkOwner,
  approveJoinRequest,
);
router.patch(
  "/:id/requests/:userId/reject",
  authenticateJWT,
  checkOwner,
  rejectJoinRequest,
);

router.get("/:id/requests", authenticateJWT, checkOwner, viewPendingRequests);

router.delete(
  "/:classroomId/members/:userId",
  authenticateJWT,
  checkOwner,
  removeMember,
);

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
