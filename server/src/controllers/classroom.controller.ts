import type { Request, Response } from "express";
import { addUserToStreamChannel, createStreamChannel } from "services/Stream";
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
} from "services/Classroom";
import { errorResponse } from "utils";
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

    return res.status(201).json(newClassroom);
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
    res.status(200).json({ message: "Classroom deleted successfully" });
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

    if (!classroom.getStreamChannel) {
      return errorResponse(res, "Classroom chat channel not available", 500);
    }

    if (classroom.accessType === "public") {
      await createMembership(classroom.id, userId, "approved");
      await addUserToStreamChannel(classroom.getStreamChannel, userId);

      return res.status(201).json({ message: "Joined classroom successfully" });
    } else {
      await createMembership(classroom.id, userId, "pending");
      return res.status(201).json({ message: "Join request submitted" });
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
    res.status(200).json(pendingRequests);
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

    res.status(200).json({ message: "Join request approved" });
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

    res.status(200).json({ message: "Join request rejected" });
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

    res.status(200).json({ message: "Join request canceled successfully" });
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

    return res.status(200).json(classroomsData);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
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

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to remove member from classroom");
  }
};
