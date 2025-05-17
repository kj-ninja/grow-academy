import type { Response } from "express";
import { ClassroomService } from "services/application/ClassroomService";
import { controllerHandler, errorResponse } from "utils";
import type { EnhancedAuthRequest } from "types/auth.types";
import type { Images } from "types/infrastructure/express/requests";

// Initialize service
const classroomService = new ClassroomService();

/**
 * Create a new classroom
 */
export const createClassroom = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const files = req.files as Images;

    const classroom = await classroomService.createClassroom({
      userId,
      ...req.body,
      avatarImage: files?.avatarImage?.[0]?.buffer || null,
      backgroundImage: files?.backgroundImage?.[0]?.buffer || null,
    });

    return res.status(201).json(classroom);
  },
);

/**
 * Update an existing classroom
 */
export const updateClassroom = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = Number(req.params.id);
    const files = req.files as Images;

    if (isNaN(classroomId)) {
      return errorResponse(res, "Invalid classroom ID", 400);
    }

    const updatedClassroom = await classroomService.updateClassroom(
      classroomId,
      userId,
      {
        ...req.body,
        avatarImage: files?.avatarImage?.[0]?.buffer || null,
        backgroundImage: files?.backgroundImage?.[0]?.buffer || null,
      },
    );

    return res.status(200).json(updatedClassroom);
  },
);

/**
 * Delete a classroom
 */
export const deleteClassroom = async (
  req: EnhancedAuthRequest,
  res: Response,
) => {
  const userId = req.authenticatedUser.id;
  const classroomId = Number(req.params.id);

  if (isNaN(classroomId)) {
    return errorResponse(res, "Invalid classroom ID", 400);
  }

  try {
    await classroomService.deleteClassroom(classroomId, userId);
    return res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting classroom:", error);
    return errorResponse(
      res,
      error.message || "Failed to delete classroom",
      error.statusCode || 500,
    );
  }
};

/**
 * Get all classrooms with pagination
 */
export const getClassrooms = async (
  req: EnhancedAuthRequest,
  res: Response,
) => {
  const userId = req.authenticatedUser.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filterByOwner = req.query.owner === "true";

  try {
    const classroomsData = await classroomService.getClassrooms(
      userId,
      page,
      limit,
      filterByOwner,
    );

    return res.status(200).json(classroomsData);
  } catch (error: any) {
    console.error("Error fetching classrooms:", error);
    return errorResponse(
      res,
      error.message || "Failed to fetch classrooms",
      error.statusCode || 500,
    );
  }
};

/**
 * Get a single classroom by ID
 */
export const getClassroom = async (req: EnhancedAuthRequest, res: Response) => {
  const userId = req.authenticatedUser.id;
  const classroomId = Number(req.params.id);

  try {
    const classroom = await classroomService.getClassroomDetails(
      classroomId,
      userId,
    );
    return res.status(200).json(classroom);
  } catch (error: any) {
    console.error("Error fetching classroom details:", error);
    return errorResponse(
      res,
      error.message || "Failed to fetch classroom details",
      error.statusCode || 500,
    );
  }
};

/**
 * Validate if classroom name is available
 */
export const validateClassroomName = async (
  req: EnhancedAuthRequest,
  res: Response,
) => {
  const classroomName = req.params.classroomName as string | undefined;

  if (!classroomName) {
    return res.status(400).json({
      success: false,
      error: "Classroom name is required",
    });
  }

  try {
    const isAvailable =
      await classroomService.isClassroomNameAvailable(classroomName);

    if (!isAvailable) {
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

/**
 * Validate if classroom handle is available
 */
export const validateClassroomHandle = async (
  req: EnhancedAuthRequest,
  res: Response,
) => {
  const handle = req.params.handle as string | undefined;

  if (!handle) {
    return res.status(400).json({
      success: false,
      error: "Classroom Handle is required",
    });
  }

  try {
    const isAvailable =
      await classroomService.isClassroomHandleAvailable(handle);

    if (!isAvailable) {
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
