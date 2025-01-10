import type { Request, Response } from "express";
import { addUserToStreamChannel, createStreamChannel } from "services/Stream";
import {
  createClassroomInDB,
  createMembership,
  deleteClassroomInDB,
  deleteClassroomMember,
  deletePendingMembership,
  findClassroomByName,
  findClassroomById,
  findPendingRequests,
  getClassroomsWithPagination,
  updateMembershipStatus,
  getUserMembershipStatus,
  leaveClassroom,
  updateClassroomInDB,
  getClassroomDetails,
  findClassroomByHandle,
} from "services/Classroom";
import { errorResponse, validateHandle } from "utils";
import type { AuthenticatedRequest, Images } from "types/types";

export const createClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.user!;
  // todo: strong typing for body
  const { classroomName, handle, description, accessType, tags } = req.body;

  const files = req.files as Images;
  const avatarImage = files?.avatarImage?.[0];
  const backgroundImage = files?.backgroundImage?.[0];

  if (!classroomName || !handle) {
    return errorResponse(res, "Classroom Name and Handle are required", 400);
  }

  try {
    validateHandle(handle);

    const channelId = handle;
    await createStreamChannel(channelId, classroomName, userId);

    const newClassroom = await createClassroomInDB(userId, {
      classroomName,
      handle,
      description,
      accessType: accessType || "Public",
      avatarImage: avatarImage ? avatarImage.buffer : null,
      backgroundImage: backgroundImage ? backgroundImage.buffer : null,
      getStreamChannelId: channelId,
      tags: tags ? tags : [],
    });

    return res.status(201).json(newClassroom);
  } catch (error) {
    console.error("Error creating classroom:", error);
    return errorResponse(res, "Failed to create classroom");
  }
};

export const updateClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  const { classroomName, handle, description, accessType, tags } = req.body;
  const files = req.files as Images;
  const avatarImage = files?.avatarImage?.[0];
  const backgroundImage = files?.backgroundImage?.[0];

  try {
    const classroom = await findClassroomById(classroomId);

    if (!classroom) {
      return errorResponse(res, "Classroom not found", 404);
    }

    if (classroom.ownerId !== userId) {
      return errorResponse(res, "Only the owner can update the classroom", 403);
    }

    if (classroomName && classroomName !== classroom.classroomName) {
      const existingClassroom = await findClassroomByName(classroomName);
      if (existingClassroom) {
        return errorResponse(
          res,
          "A classroom with this name already exists",
          409,
        );
      }
    }

    const updatedClassroom = await updateClassroomInDB(classroomId, {
      classroomName: classroomName || classroom.classroomName,
      handle: handle || classroom.handle,
      description: description || classroom.description,
      accessType: accessType || classroom.accessType,
      avatarImage: avatarImage ? avatarImage.buffer : null,
      backgroundImage: backgroundImage ? backgroundImage.buffer : null,
      tags: tags ? tags : classroom.tags,
    });

    res.status(200).json(updatedClassroom);
  } catch (error) {
    console.error("Error updating classroom:", error);
    return errorResponse(res, "Failed to update classroom");
  }
};

export const deleteClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.user!;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

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

export const getClassroomDetailsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = req.params.id;

  try {
    const classroom = await getClassroomDetails(Number(classroomId));

    if (!classroom) {
      return errorResponse(res, "Classroom not found", 404);
    }

    const { isMember, isPendingRequest } = await getUserMembershipStatus(
      userId,
      classroom.id,
    );

    // Transform the response
    const { _count, members, ...classroomData } = classroom;

    // Extract members as an array of user objects
    const formattedMembers = members.map(({ user }) => user);

    return res.status(200).json({
      ...classroomData,
      members: formattedMembers, // Use the transformed array
      membersCount: _count?.members || 0, // Convert _count to membersCount
      tags: classroom.tags ? JSON.parse(classroom.tags) : [],
      isPendingRequest,
      isMember,
    });
  } catch (error) {
    console.error("Error fetching classroom details:", error);
    return errorResponse(res, "Failed to fetch classroom details");
  }
};

export const joinRequest = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const classroom = await findClassroomById(classroomId);

    if (!classroom) {
      return errorResponse(res, "Classroom not found", 404);
    }

    if (!classroom.getStreamChannelId) {
      return errorResponse(res, "Classroom chat channel not available", 500);
    }

    if (classroom.accessType === "Public") {
      await createMembership(classroom.id, userId, "approved");
      await addUserToStreamChannel(classroom.getStreamChannelId, userId);

      return res.status(201).json({ message: "Joined classroom successfully" });
    } else {
      await createMembership(classroom.id, userId, "pending");
      return res
        .status(201)
        .json({ message: "Join request submitted", data: { classroomId } });
    }
  } catch (error) {
    console.error("Error joining classroom:", error);
    return errorResponse(res, "Failed to join classroom");
  }
};

export const cancelJoinRequest = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

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

export const leaveClassroomController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const result = await leaveClassroom(classroomId, userId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error leaving classroom:", error);
    return errorResponse(res, "Failed to leave the classroom");
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId) || isNaN(userId)) {
    return errorResponse(res, "Invalid userId or classroomId", 400);
  }

  try {
    const updatedCount = await updateMembershipStatus(
      classroomId,
      userId,
      "approved",
    );

    if (updatedCount === 0) {
      return errorResponse(res, "Request not found", 404);
    }

    // await addUserToStreamChannel(classroom.getStreamChannelId, userId);
    res.status(200).json({
      message: "Join request approved",
      data: { classroomId, userId },
    });
  } catch (error) {
    return errorResponse(res, "Failed to approve request");
  }
};

export const rejectJoinRequest = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId) || isNaN(userId)) {
    return errorResponse(res, "Invalid userId or classroomId", 400);
  }

  try {
    const deletedCount = await deletePendingMembership(classroomId, userId);
    console.log("deletedCount", deletedCount);

    if (deletedCount === 0) {
      return errorResponse(res, "Request not found", 404);
    }

    res.status(200).json({
      message: "Join request rejected",
      data: { classroomId, userId },
    });
  } catch (error) {
    return errorResponse(res, "Failed to reject request");
  }
};

export const viewPendingRequests = async (req: Request, res: Response) => {
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    const pendingRequests = await findPendingRequests(classroomId);
    res.status(200).json(pendingRequests);
  } catch (error) {
    return errorResponse(res, "Failed to fetch pending requests");
  }
};

export const removeMember = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const memberId = parseInt(req.params.userId);
  const classroomId = parseInt(req.params.id);

  if (isNaN(classroomId) || isNaN(memberId)) {
    return errorResponse(res, "Invalid userId or classroomId", 400);
  }

  try {
    const classroom = await findClassroomById(classroomId);

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
      classroomId,
      memberId,
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

export const checkClassroomName = async (req: Request, res: Response) => {
  const classroomName = req.params.classroomName as string | undefined;

  if (!classroomName) {
    return res.status(400).json({
      success: false,
      error: "Classroom name is required",
    });
  }

  try {
    const classroom = await findClassroomByName(classroomName);

    if (classroom) {
      return res.status(409).json({
        success: false,
        error: "The name already exists",
      });
    }
    return res.status(200).json({
      success: true,
      data: { exists: false },
    });
  } catch (error) {
    console.error("Error checking classroom name:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to check classroom name",
    });
  }
};

export const checkClassroomHandle = async (req: Request, res: Response) => {
  const handle = req.params.handle as string | undefined;

  if (!handle) {
    return res.status(400).json({
      success: false,
      error: "Classroom Handle is required",
    });
  }

  try {
    const classroom = await findClassroomByHandle(handle);

    if (classroom) {
      return res.status(409).json({
        success: false,
        error: "The Community Handle already exists",
      });
    }
    return res.status(200).json({
      success: true,
      data: { exists: false },
    });
  } catch (error) {
    console.error("Error checking Classroom Handle:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to check Classroom Handle",
    });
  }
};
