import type { Response } from "express";
import { ClassroomMembershipService } from "services/application/ClassroomMembershipService";
import type {
  ClassroomRequest,
  ClassroomUserRequest,
} from "../types/infrastructure/express/requests";
import { controllerHandler } from "../utils/controllerHandler";

const membershipService = new ClassroomMembershipService();

/**
 * Create a request to join a classroom
 */
export const createClassroomMembership = controllerHandler(
  async (req: ClassroomRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = req.validatedParams.id;

    const result = await membershipService.createJoinRequest(classroomId, userId);
    return res.status(201).json(result);
  }
);

/**
 * Cancel a pending join request
 */
export const cancelClassroomMembershipRequest = controllerHandler(
  async (req: ClassroomRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = req.validatedParams.id;

    const result = await membershipService.cancelJoinRequest(
      { classroomId, userId },
      userId
    );
    return res.status(200).json(result);
  }
);

/**
 * Leave a classroom (delete own membership)
 */
export const deleteClassroomMembership = controllerHandler(
  async (req: ClassroomRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = req.validatedParams.id;

    const result = await membershipService.leaveClassroom(classroomId, userId);
    return res.status(200).json(result);
  }
);

/**
 * Get all pending join requests for a classroom
 */
export const getClassroomPendingRequests = controllerHandler(
  async (req: ClassroomRequest, res: Response) => {
    const adminId = req.authenticatedUser.id;
    const classroomId = req.validatedParams.id;

    const pendingRequests = await membershipService.getPendingRequests(
      classroomId,
      adminId
    );
    return res.status(200).json(pendingRequests);
  }
);

/**
 * Approve a join request
 */
export const approveClassroomMembershipRequest = controllerHandler(
  async (req: ClassroomUserRequest, res: Response) => {
    const adminId = req.authenticatedUser.id;
    const userId = req.validatedParams.userId;
    const classroomId = req.validatedParams.id;

    const result = await membershipService.approveJoinRequest(
      { classroomId, userId },
      adminId
    );
    return res.status(200).json(result);
  }
);

/**
 * Reject a join request
 */
export const rejectClassroomMembershipRequest = controllerHandler(
  async (req: ClassroomUserRequest, res: Response) => {
    const adminId = req.authenticatedUser.id;
    const userId = req.validatedParams.userId;
    const classroomId = req.validatedParams.id;

    const result = await membershipService.rejectJoinRequest(
      { classroomId, userId },
      adminId
    );
    return res.status(200).json(result);
  }
);

/**
 * Remove a member from a classroom (admin operation)
 */
export const removeClassroomMember = controllerHandler(
  async (req: ClassroomUserRequest, res: Response) => {
    const adminId = req.authenticatedUser.id;
    const memberId = req.validatedParams.userId;
    const classroomId = req.validatedParams.id;

    const result = await membershipService.removeMember(classroomId, memberId, adminId);
    return res.status(200).json(result);
  }
);
