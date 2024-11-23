import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadResource = async (req: Request, res: Response) => {
  const { id: classroomId } = req.params; // Classroom ID from route
  const userId = req.user?.id; // Authenticated user ID from JWT middlewares

  if (!userId || !req.file) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    // Save the file data in the Resource model
    const resource = await prisma.resource.create({
      data: {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileData: req.file.buffer, // Store binary data directly
        uploadedById: userId,
        classroomId: parseInt(classroomId),
      },
    });

    res.status(201).json({ message: "File uploaded successfully", resource });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload file" });
  }
};

export const getResources = async (req: Request, res: Response) => {
  const { id: classroomId } = req.params;

  try {
    const resources = await prisma.resource.findMany({
      where: { classroomId: parseInt(classroomId) },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        uploadedAt: true,
        uploadedBy: {
          select: { username: true },
        },
      },
    });

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve resources" });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: resourceId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Find the resource to check ownership
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(resourceId) },
      include: { classroom: true },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if the user is the owner of the classroom or the uploader
    if (
      resource.uploadedById !== userId &&
      resource.classroom.ownerId !== userId
    ) {
      return res.status(403).json({
        message: "You do not have permission to delete this resource",
      });
    }

    // Delete the resource
    await prisma.resource.delete({
      where: { id: parseInt(resourceId) },
    });

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete resource" });
  }
};

export const downloadResource = async (req: Request, res: Response) => {
  const { id: resourceId } = req.params;

  try {
    // Fetch the resource including its binary data
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(resourceId) },
      select: { fileName: true, fileType: true, fileData: true },
    });

    if (!resource || !resource.fileData) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resource.fileName}"`,
    );
    res.setHeader("Content-Type", resource.fileType);

    // Send the binary data
    res.send(resource.fileData);
  } catch (error) {
    res.status(500).json({ message: "Failed to download resource" });
  }
};
