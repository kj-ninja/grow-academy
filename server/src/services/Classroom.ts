import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClassroomInDB = async (userId: number, data: any) => {
  return prisma.classroom.create({
    data: {
      ...data,
      ownerId: userId,
    },
  });
};

export const deleteClassroomInDB = async (classroomId: number) => {
  return prisma.classroom.delete({
    where: { id: classroomId },
  });
};

export const createMembership = async (
  classroomId: number,
  userId: number,
  memberShipStatus: "approved" | "pending" = "approved",
) => {
  return prisma.classroomsMembers.create({
    data: {
      classroomId,
      userId,
      memberShipStatus,
    },
  });
};

export const findPendingRequests = async (classroomId: number) => {
  return prisma.classroomsMembers.findMany({
    where: {
      classroomId,
      memberShipStatus: "pending",
    },
    include: { user: true },
  });
};

export const updateMembershipStatus = async (
  classroomId: number,
  userId: number,
  status: string,
) => {
  const membership = await prisma.classroomsMembers.updateMany({
    where: {
      classroomId,
      userId,
      memberShipStatus: "pending",
    },
    data: { memberShipStatus: status },
  });

  return membership.count;
};

export const deletePendingMembership = async (
  classroomId: number,
  userId: number,
) => {
  const membership = await prisma.classroomsMembers.deleteMany({
    where: {
      classroomId,
      userId,
      memberShipStatus: "pending",
    },
  });

  return membership.count;
};

export const getClassroomsWithPagination = async (
  userId: number,
  page: number,
  limit: number,
  filterByOwner: boolean,
) => {
  const skip = (page - 1) * limit;
  const [classrooms, totalClassrooms] = await prisma.$transaction([
    prisma.classroom.findMany({
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
      },
    }),
    prisma.classroom.count({
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
};

export const findClassroomById = async (classroomId: number) => {
  return prisma.classroom.findUnique({
    where: { id: classroomId },
  });
};

export const deleteClassroomMember = async (
  classroomId: number,
  memberId: number,
  ownerId: number,
) => {
  const member = await prisma.classroomsMembers.findUnique({
    where: {
      userId_classroomId: {
        userId: memberId,
        classroomId,
      },
    },
  });

  if (!member || member.userId === ownerId) {
    return 0;
  }

  const deletedMember = await prisma.classroomsMembers.delete({
    where: {
      userId_classroomId: {
        userId: memberId,
        classroomId,
      },
    },
  });

  return deletedMember ? 1 : 0;
};

export const findClassroomByName = async (classroomName: string) => {
  return prisma.classroom.findFirst({
    where: { classroomName },
  });
};

export const findClassroomByHandle = async (handle: string) => {
  return prisma.classroom.findUnique({
    where: { handle },
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
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });
};

export async function getUserMembershipStatus(
  userId: number,
  classroomId: number,
) {
  const membership = await prisma.classroomsMembers.findFirst({
    where: { userId, classroomId },
  });

  const isMember = membership?.memberShipStatus === "approved";
  const isPendingRequest = membership?.memberShipStatus === "pending";

  return { isMember, isPendingRequest };
}

export const leaveClassroom = async (classroomId: number, userId: number) => {
  // Check if the user is a member of the classroom
  const membership = await prisma.classroomsMembers.findUnique({
    where: {
      userId_classroomId: {
        userId,
        classroomId,
      },
    },
  });

  if (!membership) {
    return { success: false, message: "Membership not found" };
  }

  // Only proceed if the user is not the owner
  if (membership.role === "owner") {
    return {
      success: false,
      message: "Owners cannot leave their own classroom",
    };
  }

  // Delete the membership entry
  await prisma.classroomsMembers.delete({
    where: {
      userId_classroomId: {
        userId,
        classroomId,
      },
    },
  });

  return { success: true, message: "Successfully left the classroom" };
};
