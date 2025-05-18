import { ClassroomRepository } from "services/infrastructure/ClassroomRepository";
import { createStreamChannel } from "services/infrastructure/StreamChannelService";
import type { ClassroomCreateParams, ClassroomUpdateData } from "types/domain/classroom";
import { ApplicationError, ConflictError } from "../../utils/errors";
import { validateHandle } from "../../validations";

// todo: think about: DEPENDENCY INJECTION PATTERN
// Factory Pattern: Creates and configures instances with their dependencies
export class ClassroomService {
  private repository: ClassroomRepository;

  constructor() {
    this.repository = new ClassroomRepository();
  }

  async createClassroom(data: ClassroomCreateParams) {
    const {
      userId,
      classroomName,
      handle,
      description,
      accessType,
      tags,
      avatarImage,
      backgroundImage,
    } = data;

    if (!classroomName || !handle) {
      throw new ApplicationError("Classroom Name and Handle are required", 400);
    }

    // Validate handle format
    validateHandle(data.handle);

    // Check for existing classroom
    const existingName = await this.repository.findClassroomByName(data.classroomName);
    if (existingName) {
      throw new ConflictError(
        `A classroom with name "${data.classroomName}" already exists`
      );
    }

    const existingHandle = await this.repository.findClassroomByHandle(data.handle);
    if (existingHandle) {
      throw new ConflictError(`A classroom with handle "${data.handle}" already exists`);
    }

    const channelId = handle;

    // Create stream channel
    await createStreamChannel(channelId, classroomName, userId);

    // Create classroom in database
    const newClassroom = await this.repository.createClassroomInDB(userId, {
      classroomName,
      handle,
      description,
      accessType: accessType || "Public",
      avatarImage: avatarImage,
      backgroundImage: backgroundImage,
      getStreamChannelId: channelId,
      tags: tags || [],
    });

    return newClassroom;
  }

  async updateClassroom(classroomId: number, userId: number, data: ClassroomUpdateData) {
    const classroom = await this.repository.findClassroomById(classroomId);

    if (!classroom) {
      throw new ApplicationError("Classroom not found", 404);
    }

    if (classroom.ownerId !== userId) {
      throw new ApplicationError("Only the owner can update the classroom", 403);
    }

    // Check if new handle is available
    if (data.handle && data.handle !== classroom.handle) {
      const existingClassroomByHandle = await this.repository.findClassroomByHandle(
        data.handle
      );
      if (existingClassroomByHandle) {
        throw new ApplicationError("A classroom with this handle already exists", 409);
      }

      // Validate handle format
      validateHandle(data.handle);
    }

    // Check if new classroom name is available
    if (data.classroomName && data.classroomName !== classroom.classroomName) {
      const existingClassroom = await this.repository.findClassroomByName(
        data.classroomName
      );
      if (existingClassroom) {
        throw new ApplicationError("A classroom with this name already exists", 409);
      }
    }

    const updatedClassroom = await this.repository.updateClassroomInDB(classroomId, {
      classroomName: data.classroomName || classroom.classroomName,
      handle: data.handle || classroom.handle,
      description: data.description ?? classroom.description,
      accessType: data.accessType || classroom.accessType,
      avatarImage: data.avatarImage,
      backgroundImage: data.backgroundImage,
      tags: data.tags ?? JSON.parse(classroom.tags || "[]"),
    });

    return updatedClassroom;
  }

  /**
   * Get classroom details with membership status
   */
  async getClassroomDetails(classroomId: number, userId: number) {
    const classroom = await this.repository.getClassroomDetails(classroomId);

    if (!classroom) {
      throw new ApplicationError("Classroom not found", 404);
    }

    const { isMember, isPendingRequest } = await this.repository.getUserMembershipStatus(
      userId,
      classroom.id
    );

    // Transform the response
    const { _count, members, ...classroomData } = classroom;

    // Extract members as an array of user objects
    const formattedMembers = members.map(({ user }) => user);

    return {
      ...classroomData,
      members: formattedMembers,
      membersCount: _count?.members || 0,
      tags: classroom.tags ? JSON.parse(classroom.tags) : [],
      isPendingRequest,
      isMember,
    };
  }

  /**
   * Get classroom list with pagination
   */
  async getClassrooms(
    userId: number,
    page: number,
    limit: number,
    filterByOwner: boolean
  ) {
    return await this.repository.getClassroomsWithPagination(
      userId,
      page,
      limit,
      filterByOwner
    );
  }

  async deleteClassroom(classroomId: number, userId: number) {
    const classroom = await this.repository.findClassroomById(classroomId);

    if (!classroom) {
      throw new ApplicationError("Classroom not found", 404);
    }

    if (classroom.ownerId !== userId) {
      throw new ApplicationError("Only the owner can delete the classroom", 403);
    }

    await this.repository.deleteClassroomInDB(classroomId);
  }

  /**
   * Check if classroom name is available
   */
  async isClassroomNameAvailable(name: string): Promise<boolean> {
    const classroom = await this.repository.findClassroomByName(name);
    return !classroom;
  }

  /**
   * Check if classroom handle is available
   */
  async isClassroomHandleAvailable(handle: string): Promise<boolean> {
    const classroom = await this.repository.findClassroomByHandle(handle);
    return !classroom;
  }
}
