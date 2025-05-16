import { PrismaClient } from "@prisma/client";

export class ClassroomMembershipRepository {
  private prisma: PrismaClient;

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma;
  }

  /**
   * Create a membership (approved or pending)
   */
  async createMembership(
    classroomId: number,
    userId: number,
    memberShipStatus: "approved" | "pending" = "approved",
  ) {
    return this.prisma.classroomsMembers.create({
      data: {
        classroomId,
        userId,
        memberShipStatus,
      },
    });
  }

  /**
   * Find pending join requests for a classroom
   */
  async findPendingRequests(classroomId: number) {
    return this.prisma.classroomsMembers.findMany({
      where: {
        classroomId,
        memberShipStatus: "pending",
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
    });
  }

  /**
   * Update the status of a membership request
   */
  async updateMembershipStatus(
    classroomId: number,
    userId: number,
    status: string,
  ) {
    const membership = await this.prisma.classroomsMembers.updateMany({
      where: {
        classroomId,
        userId,
        memberShipStatus: "pending",
      },
      data: { memberShipStatus: status },
    });

    return membership.count;
  }

  /**
   * Delete a pending membership request
   */
  async deletePendingMembership(classroomId: number, userId: number) {
    const membership = await this.prisma.classroomsMembers.deleteMany({
      where: {
        classroomId,
        userId,
        memberShipStatus: "pending",
      },
    });

    return membership.count;
  }

  /**
   * Leave a classroom (delete membership)
   */
  async leaveClassroom(classroomId: number, userId: number) {
    // Check if the user is a member of the classroom
    const membership = await this.prisma.classroomsMembers.findUnique({
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
    await this.prisma.classroomsMembers.delete({
      where: {
        userId_classroomId: {
          userId,
          classroomId,
        },
      },
    });

    return { success: true, message: "Successfully left the classroom" };
  }

  /**
   * Remove a member from a classroom (admin operation)
   */
  async deleteClassroomMember(
    classroomId: number,
    memberId: number,
    ownerId: number,
  ) {
    const member = await this.prisma.classroomsMembers.findUnique({
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

    const deletedMember = await this.prisma.classroomsMembers.delete({
      where: {
        userId_classroomId: {
          userId: memberId,
          classroomId,
        },
      },
    });

    return deletedMember ? 1 : 0;
  }

  /**
   * Check if a user is a member of a classroom
   */
  async isMember(userId: number, classroomId: number) {
    const membership = await this.prisma.classroomsMembers.findUnique({
      where: {
        userId_classroomId: {
          userId,
          classroomId,
        },
      },
    });

    return membership?.memberShipStatus === "approved";
  }

  /**
   * Find a specific membership by userId and classroomId
   */
  async findMembership(userId: number, classroomId: number) {
    return this.prisma.classroomsMembers.findUnique({
      where: {
        userId_classroomId: {
          userId,
          classroomId,
        },
      },
    });
  }
}
