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
  joinClassroom,
  rejectJoinRequest,
  removeMember,
  viewPendingRequests,
} from "@controllers/classroom.controller";
import { upload, uploadMultiple } from "@middleware/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "@controllers/resource.controller";

const router = Router();

router.get("/", authenticateJWT, getClassrooms);
router.get("/:handle/", authenticateJWT, getClassroomDetails);

router.post("/", authenticateJWT, uploadMultiple, createClassroom);
router.delete("/:id", authenticateJWT, deleteClassroom);

router.post("/:id/join", authenticateJWT, joinClassroom);
router.delete("/:id/join", authenticateJWT, cancelJoinRequest);
router.get("/:id/requests", authenticateJWT, checkOwner, viewPendingRequests);
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

router.delete(
  "/:classroomId/members/:userId",
  authenticateJWT,
  checkOwner,
  removeMember,
);

router.get("/check-name/:classroomName", authenticateJWT, checkClassroomName);
router.get("/check-handle/:handle", authenticateJWT, checkClassroomHandle);

router.post(
  "/:id/resources",
  authenticateJWT,
  upload.single("file"),
  uploadResource,
);
router.get("/:id/resources", authenticateJWT, getResources);
router.delete("/resources/:id", authenticateJWT, deleteResource);
router.get("/resources/:id/download", authenticateJWT, downloadResource);

export default router;
