import type { Response } from "express";
import { ClassroomMembershipService } from "services/application/ClassroomMembershipService";
import type { AuthenticatedRequest } from "types/auth.types";
import { errorResponse } from "utils";

// Initialize service
const membershipService = new ClassroomMembershipService();

/**
 * Create a request to join a classroom
 */
export const createClassroomMembership = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const result = await membershipService.createJoinRequest(
      classroomId,
      userId,
    );
    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Error creating membership request:", error);
    return errorResponse(
      res,
      error.message || "Failed to join classroom",
      error.statusCode || 500,
    );
  }
};

/**
 * Cancel a pending join request
 */
export const cancelClassroomMembershipRequest = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const result = await membershipService.cancelJoinRequest(
      { classroomId, userId },
      userId,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error canceling membership request:", error);
    return errorResponse(
      res,
      error.message || "Failed to cancel request",
      error.statusCode || 500,
    );
  }
};

/**
 * Leave a classroom (delete own membership)
 */
export const deleteClassroomMembership = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const result = await membershipService.leaveClassroom(classroomId, userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error leaving classroom:", error);
    return errorResponse(
      res,
      error.message || "Failed to leave classroom",
      error.statusCode || 500,
    );
  }
};

/**
 * Get all pending join requests for a classroom
 */
export const getClassroomPendingRequests = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const adminId = req.user!.id;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const pendingRequests = await membershipService.getPendingRequests(
      classroomId,
      adminId,
    );
    return res.status(200).json(pendingRequests);
  } catch (error: any) {
    console.error("Error fetching pending requests:", error);
    return errorResponse(
      res,
      error.message || "Failed to fetch pending requests",
      error.statusCode || 500,
    );
  }
};

/**
 * Approve a join request
 */
export const approveClassroomMembershipRequest = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const adminId = req.user!.id;
  const classroomId = Number(req.params.id);
  const userId = Number(req.params.userId);

  if (isNaN(classroomId) || isNaN(userId)) {
    return errorResponse(res, "Invalid classroom ID or user ID", 400);
  }

  try {
    const result = await membershipService.approveJoinRequest(
      { classroomId, userId },
      adminId,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error approving request:", error);
    return errorResponse(
      res,
      error.message || "Failed to approve request",
      error.statusCode || 500,
    );
  }
};

/**
 * Reject a join request
 */
export const rejectClassroomMembershipRequest = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const adminId = req.user!.id;
  const classroomId = Number(req.params.id);
  const userId = Number(req.params.userId);

  if (isNaN(classroomId) || isNaN(userId)) {
    return errorResponse(res, "Invalid classroom ID or user ID", 400);
  }

  try {
    const result = await membershipService.rejectJoinRequest(
      { classroomId, userId },
      adminId,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error rejecting request:", error);
    return errorResponse(
      res,
      error.message || "Failed to reject request",
      error.statusCode || 500,
    );
  }
};

/**
 * Remove a member from a classroom (admin operation)
 */
export const removeClassroomMember = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const adminId = req.user!.id;
  const classroomId = Number(req.params.id);
  const memberId = Number(req.params.userId);

  if (isNaN(classroomId) || isNaN(memberId)) {
    return errorResponse(res, "Invalid classroom ID or user ID", 400);
  }

  try {
    const result = await membershipService.removeMember(
      classroomId,
      memberId,
      adminId,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error removing member:", error);
    return errorResponse(
      res,
      error.message || "Failed to remove member",
      error.statusCode || 500,
    );
  }
};
