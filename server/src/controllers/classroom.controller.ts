import type { Response } from "express";
import { ClassroomService } from "services/application/ClassroomService";

import type { EnhancedAuthRequest, Images } from "types/infrastructure/express/requests";
import { controllerHandler } from "../utils/controllerHandler";
import { errorResponse } from "../utils/errors";

const classroomService = new ClassroomService();

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
  }
);

export const updateClassroom = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = Number(req.params.id);
    const files = req.files as Images;

    if (isNaN(classroomId)) {
      return errorResponse(res, "Invalid classroom ID", 400);
    }

    const updatedClassroom = await classroomService.updateClassroom(classroomId, userId, {
      ...req.body,
      avatarImage: files?.avatarImage?.[0]?.buffer || null,
      backgroundImage: files?.backgroundImage?.[0]?.buffer || null,
    });

    return res.status(200).json(updatedClassroom);
  }
);

export const deleteClassroom = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = Number(req.params.id);

    if (isNaN(classroomId)) {
      return errorResponse(res, "Invalid classroom ID", 400);
    }

    await classroomService.deleteClassroom(classroomId, userId);
    return res.status(200).json({ message: "Classroom deleted successfully" });
  }
);

/**
 * Get classroom list with pagination
 */
export const getClassrooms = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filterByOwner = req.query.owner === "true";

    const classroomsData = await classroomService.getClassrooms(
      userId,
      page,
      limit,
      filterByOwner
    );

    return res.status(200).json(classroomsData);
  }
);

/**
 * Get a single classroom by ID
 */
export const getClassroom = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const userId = req.authenticatedUser.id;
    const classroomId = Number(req.params.id);

    if (isNaN(classroomId)) {
      return errorResponse(res, "Invalid classroom ID", 400);
    }

    const classroom = await classroomService.getClassroomDetails(classroomId, userId);
    return res.status(200).json(classroom);
  }
);

/**
 * Validate if classroom name is available
 */
export const validateClassroomName = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const classroomName = req.params.classroomName;

    if (!classroomName) {
      return res.status(400).json({
        success: false,
        error: "Classroom name is required",
      });
    }

    const isAvailable = await classroomService.isClassroomNameAvailable(classroomName);

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
  }
);

/**
 * Validate if classroom handle is available
 */
export const validateClassroomHandle = controllerHandler(
  async (req: EnhancedAuthRequest, res: Response) => {
    const handle = req.params.handle;

    if (!handle) {
      return res.status(400).json({
        success: false,
        error: "Classroom Handle is required",
      });
    }

    const isAvailable = await classroomService.isClassroomHandleAvailable(handle);

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
  }
);
