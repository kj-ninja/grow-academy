import { PrismaClient } from "@prisma/client";

export class ClassroomRepository {
  private prisma: PrismaClient;

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma;
  }

  /**
   * Create a new classroom in the database
   */
  async createClassroomInDB(userId: number, data: any) {
    return this.prisma.classroom.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
  }

  /**
   * Find a classroom by its ID
   */
  async findClassroomById(classroomId: number) {
    return this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });
  }

  /**
   * Find a classroom by its name
   */
  async findClassroomByName(classroomName: string) {
    return this.prisma.classroom.findFirst({
      where: { classroomName },
    });
  }

  /**
   * Find a classroom by its handle
   */
  async findClassroomByHandle(handle: string) {
    return this.prisma.classroom.findFirst({
      where: { handle },
    });
  }

  /**
   * Update an existing classroom
   */
  async updateClassroomInDB(
    classroomId: number,
    data: {
      classroomName?: string;
      handle?: string;
      description?: string | null;
      accessType?: string;
      avatarImage?: Buffer | null;
      backgroundImage?: Buffer | null;
      tags?: string[] | null;
    },
  ) {
    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: {
        ...data,
        tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
      },
    });
  }

  /**
   * Delete a classroom from the database
   */
  async deleteClassroomInDB(classroomId: number) {
    return this.prisma.classroom.delete({
      where: { id: classroomId },
    });
  }

  /**
   * Get detailed classroom information with members
   */
  async getClassroomDetails(classroomId: number) {
    return this.prisma.classroom.findUnique({
      where: { id: classroomId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarImage: true,
          },
        },
        members: {
          where: {
            memberShipStatus: "approved",
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarImage: true,
              },
            },
          },
        },
        _count: {
          select: { members: true },
        },
      },
    });
  }

  /**
   * Check if a user is a member or has a pending request
   */
  async getUserMembershipStatus(userId: number, classroomId: number) {
    const membership = await this.prisma.classroomsMembers.findUnique({
      where: {
        userId_classroomId: {
          userId,
          classroomId,
        },
      },
    });

    return {
      isMember: membership?.memberShipStatus === "approved",
      isPendingRequest: membership?.memberShipStatus === "pending",
    };
  }

  /**
   * Get paginated classrooms with filtering options
   */
  async getClassroomsWithPagination(
    userId: number,
    page: number,
    limit: number,
    filterByOwner: boolean,
  ) {
    const skip = (page - 1) * limit;

    // Use transaction for consistent results
    const [classrooms, totalClassrooms] = await this.prisma.$transaction([
      this.prisma.classroom.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: filterByOwner ? { ownerId: userId } : {},
        include: {
          _count: {
            select: { members: true },
          },
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarImage: true,
            },
          },
          members: {
            where: { userId },
            select: { memberShipStatus: true },
          },
        },
      }),
      this.prisma.classroom.count({
        where: filterByOwner ? { ownerId: userId } : {},
      }),
    ]);

    const totalPages = Math.ceil(totalClassrooms / limit);

    const formattedClassrooms = classrooms.map((classroom) => ({
      id: classroom.id,
      classroomName: classroom.classroomName,
      handle: classroom.handle,
      description: classroom.description,
      accessType: classroom.accessType,
      createdAt: classroom.createdAt,
      updatedAt: classroom.updatedAt,
      avatarImage: classroom.avatarImage,
      backgroundImage: classroom.backgroundImage,
      membersCount: classroom._count.members,
      owner: classroom.owner,
      getStreamChannelId: classroom.getStreamChannelId,
      isLive: classroom.isLive,
      tags: classroom.tags ? JSON.parse(classroom.tags) : [],
      memberShipStatus: classroom.members[0]?.memberShipStatus || null,
    }));

    return {
      classrooms: formattedClassrooms,
      pagination: {
        totalItems: totalClassrooms,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
