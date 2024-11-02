import type { Request, Response } from "express";
import {
  addUserToStreamChannel,
  createStreamChannel,
  generateStreamToken,
} from "services/streamService";
import {
  createClassroomInDB,
  createMembership,
  deleteClassroomInDB,
  deleteClassroomMember,
  deletePendingMembership,
  findClassroomById,
  findPendingRequests,
  getClassroomsWithPagination,
  updateMembershipStatus,
} from "services/classroomService";
import { errorResponse, successResponse } from "utils";
import type { AuthenticatedRequest } from "types/types";

export const createClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.user!;
  const {
    name,
    description,
    accessType,
    communityAvatarImage,
    communityBackgroundImage,
  } = req.body;

  try {
    const channelId = `classroom-${name.replace(/[^a-zA-Z0-9-_]/g, "")}`;
    await createStreamChannel(channelId, name, userId);

    const newClassroom = await createClassroomInDB(userId, {
      name,
      description,
      accessType: accessType || "public",
      communityAvatarImage,
      communityBackgroundImage,
      getStreamChannel: channelId,
    });

    return successResponse(
      res,
      newClassroom,
      "Classroom created successfully",
      201,
    );
  } catch (error) {
    console.error("Error creating classroom:", error);
    return errorResponse(res, "Failed to create classroom");
  }
};

export const deleteClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.user!;
  const classroomId = parseInt(req.params.id);

  try {
    const classroom = await findClassroomById(classroomId);

    if (!classroom) {
      return errorResponse(res, "Classroom not found", 404);
    }

    if (classroom.ownerId !== userId) {
      return errorResponse(res, "Only the owner can delete the classroom", 403);
    }

    await deleteClassroomInDB(classroomId);
    return successResponse(res, null, "Classroom deleted successfully", 200);
  } catch (error) {
    console.error("Error deleting classroom:", error);
    return errorResponse(res, "Failed to delete classroom");
  }
};

export const joinClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id: classroomId } = req.params;

  try {
    const classroom = await findClassroomById(parseInt(classroomId));

    if (!classroom) {
      return errorResponse(res, "Classroom not found", 404);
    }

    // Ensure getStreamChannel is a string before proceeding
    if (!classroom.getStreamChannel) {
      return errorResponse(res, "Classroom chat channel not available", 500);
    }

    if (classroom.accessType === "public") {
      await createMembership(classroom.id, userId, "approved");
      await addUserToStreamChannel(classroom.getStreamChannel, userId);
      const token = generateStreamToken(userId);

      return successResponse(
        res,
        {
          message: "Joined classroom successfully",
          token,
          channelId: classroom.getStreamChannel,
        },
        "Joined classroom successfully",
        201,
      );
    } else {
      await createMembership(classroom.id, userId, "pending");
      return successResponse(
        res,
        { message: "Join request submitted" },
        "Join request submitted",
        201,
      );
    }
  } catch (error) {
    console.error("Error joining classroom:", error);
    return errorResponse(res, "Failed to join classroom");
  }
};

export const viewPendingRequests = async (req: Request, res: Response) => {
  const { id: classroomId } = req.params;

  try {
    const pendingRequests = await findPendingRequests(parseInt(classroomId));
    return successResponse(
      res,
      pendingRequests,
      "Pending requests fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, "Failed to fetch pending requests");
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  const { id: classroomId, userId } = req.params;

  try {
    const updatedCount = await updateMembershipStatus(
      parseInt(classroomId),
      parseInt(userId),
      "approved",
    );

    if (updatedCount === 0) {
      return errorResponse(res, "Request not found", 404);
    }

    return successResponse(res, null, "Join request approved");
  } catch (error) {
    return errorResponse(res, "Failed to approve request");
  }
};

export const rejectJoinRequest = async (req: Request, res: Response) => {
  const { id: classroomId, userId } = req.params;

  try {
    const deletedCount = await deletePendingMembership(
      parseInt(classroomId),
      parseInt(userId),
    );

    if (deletedCount === 0) {
      return errorResponse(res, "Request not found", 404);
    }

    return successResponse(res, null, "Join request rejected");
  } catch (error) {
    return errorResponse(res, "Failed to reject request");
  }
};

export const cancelJoinRequest = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = parseInt(req.params.id);

  try {
    const deletedCount = await deletePendingMembership(classroomId, userId);

    if (deletedCount === 0) {
      return errorResponse(res, "No pending join request found", 404);
    }

    return successResponse(res, null, "Join request canceled successfully");
  } catch (error) {
    return errorResponse(res, "Failed to cancel join request");
  }
};

export const getClassrooms = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filterByOwner = req.query.owner === "true";

  try {
    const classroomsData = await getClassroomsWithPagination(
      userId,
      page,
      limit,
      filterByOwner,
    );
    return successResponse(
      res,
      classroomsData,
      "Classrooms fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, "Failed to fetch classrooms");
  }
};

export const removeMember = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { classroomId, userId: memberId } = req.params;

  try {
    const classroom = await findClassroomById(parseInt(classroomId));

    if (!classroom) {
      return errorResponse(res, "Classroom not found", 404);
    }

    if (classroom.ownerId !== userId) {
      return errorResponse(
        res,
        "Only the owner can remove members from this classroom",
        403,
      );
    }

    const deletedCount = await deleteClassroomMember(
      parseInt(classroomId),
      parseInt(memberId),
      classroom.ownerId,
    );

    if (deletedCount === 0) {
      return errorResponse(res, "Member not found in this classroom", 404);
    }

    return successResponse(res, null, "Member removed successfully");
  } catch (error) {
    return errorResponse(res, "Failed to remove member from classroom");
  }
};
