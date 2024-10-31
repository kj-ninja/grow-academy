import { authenticateJWT } from "@middleware/authenticateJWT";
import { Router } from "express";
import { checkOwner } from "@controllers/utils";
import {
  approveJoinRequest,
  cancelJoinRequest,
  createClassroom,
  deleteClassroom,
  joinClassroom,
  rejectJoinRequest,
  viewPendingRequests,
} from "@controllers/classroom.controller";

const router = Router();

router.post("/", authenticateJWT, createClassroom);
router.delete("/:id", authenticateJWT, deleteClassroom);

router.post("/:id/join", authenticateJWT, joinClassroom);
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
router.delete("/:id/join", authenticateJWT, cancelJoinRequest);

export default router;
