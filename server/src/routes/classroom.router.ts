import { authenticateJWT } from "@middleware/authenticateJWT";
import { Router } from "express";
import { checkOwner } from "@controllers/utils";
import {
  approveJoinRequest,
  cancelJoinRequest,
  createClassroom,
  deleteClassroom,
  getClassrooms,
  joinClassroom,
  rejectJoinRequest,
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

router.get("/", authenticateJWT, getClassrooms); // GET /api/classroom?page=1&limit=10
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

router.post(
  "/:id/resources",
  authenticateJWT,
  upload.single("file"),
  uploadResource,
);
router.get("/:id/resources", authenticateJWT, getResources); // GET /api/classroom/:id/resources
router.delete("/resources/:id", authenticateJWT, deleteResource); // DELETE /api/classroom/resources/:id
router.get("/resources/:id/download", authenticateJWT, downloadResource); // GET /api/classroom/resources/:id/download

export default router;
