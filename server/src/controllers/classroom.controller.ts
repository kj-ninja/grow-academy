import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClassroom = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, description, accessType } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const newClassroom = await prisma.classroom.create({
      data: {
        name,
        description,
        accessType: accessType || "public",
        ownerId: userId,
        communityAvatarImage: req.body.communityAvatarImage || null,
        communityBackgroundImage: req.body.communityBackgroundImage || null,
      },
    });

    res.status(201).json(newClassroom);
  } catch (error) {
    res.status(500).json({ message: "Failed to create classroom" });
  }
};

export const deleteClassroom = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: classroomId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if the user is the owner of the classroom
    const classroom = await prisma.classroom.findUnique({
      where: { id: parseInt(classroomId) },
    });

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    if (classroom.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "Only the owner can delete the classroom" });
    }

    await prisma.classroom.delete({
      where: { id: parseInt(classroomId) },
    });

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete classroom" });
  }
};

export const joinClassroom = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: classroomId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: parseInt(classroomId) },
    });

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if classroom is public or private
    if (classroom.accessType === "public") {
      // Directly add user to ClassroomsMembers with approved status
      await prisma.classroomsMembers.create({
        data: {
          classroomId: parseInt(classroomId),
          userId,
          memberShipStatus: "approved",
        },
      });
      return res.status(201).json({ message: "Joined classroom successfully" });
    } else {
      // Create pending join request for private classrooms
      await prisma.classroomsMembers.create({
        data: {
          classroomId: parseInt(classroomId),
          userId,
          memberShipStatus: "pending",
        },
      });
      return res.status(201).json({ message: "Join request submitted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to join classroom" });
  }
};

export const viewPendingRequests = async (req: Request, res: Response) => {
  const { id: classroomId } = req.params;

  try {
    const pendingRequests = await prisma.classroomsMembers.findMany({
      where: {
        classroomId: parseInt(classroomId),
        memberShipStatus: "pending",
      },
      include: { user: true }, // Include user details if needed
    });

    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending requests" });
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  const { id: classroomId, userId } = req.params;

  try {
    const membership = await prisma.classroomsMembers.updateMany({
      where: {
        classroomId: parseInt(classroomId),
        userId: parseInt(userId),
        memberShipStatus: "pending",
      },
      data: { memberShipStatus: "approved" },
    });

    if (membership.count === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Join request approved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve request" });
  }
};

export const rejectJoinRequest = async (req: Request, res: Response) => {
  const { id: classroomId, userId } = req.params;

  try {
    const membership = await prisma.classroomsMembers.deleteMany({
      where: {
        classroomId: parseInt(classroomId),
        userId: parseInt(userId),
        memberShipStatus: "pending",
      },
    });

    if (membership.count === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Join request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request" });
  }
};

export const cancelJoinRequest = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: classroomId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Find and delete the pending join request
    const deletedRequest = await prisma.classroomsMembers.deleteMany({
      where: {
        classroomId: parseInt(classroomId),
        userId: userId,
        memberShipStatus: "pending",
      },
    });

    if (deletedRequest.count === 0) {
      return res.status(404).json({ message: "No pending join request found" });
    }

    res.status(200).json({ message: "Join request canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel join request" });
  }
};

export const getClassrooms = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  try {
    const [classrooms, totalClassrooms] = await prisma.$transaction([
      prisma.classroom.findMany({
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Optional: Order by creation date
      }),
      prisma.classroom.count(),
    ]);

    const totalPages = Math.ceil(totalClassrooms / limit);

    res.status(200).json({
      classrooms,
      pagination: {
        totalItems: totalClassrooms,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch classrooms" });
  }
};
