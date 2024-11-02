import { authenticateJWT } from "@middleware/authenticateJWT";
import { Router } from "express";
import { checkOwner } from "utils";
import {
  approveJoinRequest,
  cancelJoinRequest,
  createClassroom,
  deleteClassroom,
  getClassroomDetails,
  getClassrooms,
  joinClassroom,
  rejectJoinRequest,
  removeMember,
  viewPendingRequests,
} from "@controllers/classroom.controller";
import { upload } from "@middleware/uploadMiddleware";
import {
  deleteResource,
  downloadResource,
  getResources,
  uploadResource,
} from "@controllers/resource.controller";

const router = Router();

router.get("/", authenticateJWT, getClassrooms);
router.get("/:id/details", authenticateJWT, getClassroomDetails);

router.post("/", authenticateJWT, createClassroom);
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
