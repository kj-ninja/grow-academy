import { ClassroomMembershipRepository } from "services/infrastructure/ClassroomMembershipRepository";
import { ClassroomRepository } from "services/infrastructure/ClassroomRepository";
import {
  addUserToStreamChannel,
  removeUserFromStreamChannel,
} from "services/infrastructure/StreamChannelService";
import {
  ApplicationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from "../../utils/errors";

export class ClassroomMembershipService {
  private membershipRepository: ClassroomMembershipRepository;
  private classroomRepository: ClassroomRepository;

  constructor() {
    this.membershipRepository = new ClassroomMembershipRepository();
    this.classroomRepository = new ClassroomRepository();
  }

  /**
   * Create a request to join a classroom
   */
  async createJoinRequest(classroomId: number, userId: number) {
    // Check if the classroom exists
    const classroom = await this.classroomRepository.findClassroomById(classroomId);
    if (!classroom) {
      throw new NotFoundError("Classroom");
    }

    // Check if the stream channel exists
    if (!classroom.getStreamChannelId) {
      throw new ApplicationError("Classroom chat channel not available", 500);
    }

    // Check if the user is already a member or has a pending request
    const { isMember, isPendingRequest } =
      await this.classroomRepository.getUserMembershipStatus(userId, classroomId);

    if (isMember) {
      throw new ConflictError("You are already a member of this classroom");
    }

    if (isPendingRequest) {
      throw new ConflictError("You already have a pending request");
    }

    // Create the join request
    const membershipStatus = classroom.accessType === "Public" ? "approved" : "pending";
    await this.membershipRepository.createMembership(
      classroomId,
      userId,
      membershipStatus
    );

    // Add user to stream channel if approved immediately (public classroom)
    if (membershipStatus === "approved") {
      await addUserToStreamChannel(classroom.getStreamChannelId, userId);
    }

    return {
      success: true,
      message:
        membershipStatus === "approved"
          ? "Successfully joined the classroom"
          : "Join request sent successfully",
      status: membershipStatus,
    };
  }

  /**
   * Get all pending requests for a classroom
   */
  async getPendingRequests(classroomId: number, adminId: number) {
    // Check if the classroom exists
    const classroom = await this.classroomRepository.findClassroomById(classroomId);
    if (!classroom) {
      throw new NotFoundError("Classroom");
    }

    // Check if user has permission to view requests
    if (classroom.ownerId !== adminId) {
      throw new AuthorizationError("Only the owner can view pending requests");
    }

    // Get the pending requests
    const pendingRequests =
      await this.membershipRepository.findPendingRequests(classroomId);

    return pendingRequests;
  }

  /**
   * Approve a join request
   */
  async approveJoinRequest(
    requestId: { classroomId: number; userId: number },
    adminId: number
  ) {
    const { classroomId, userId } = requestId;

    // Check if the classroom exists
    const classroom = await this.classroomRepository.findClassroomById(classroomId);
    if (!classroom) {
      throw new NotFoundError("Classroom");
    }

    // Check if stream channel exists
    if (!classroom.getStreamChannelId) {
      throw new ApplicationError("Classroom chat channel not available", 500);
    }

    // Check if user has permission
    if (classroom.ownerId !== adminId) {
      throw new AuthorizationError("Only the owner can approve requests");
    }

    // Update the request status
    const result = await this.membershipRepository.updateMembershipStatus(
      classroomId,
      userId,
      "approved"
    );

    if (result === 0) {
      throw new NotFoundError("Membership request");
    }

    // Add user to stream channel
    await addUserToStreamChannel(classroom.getStreamChannelId, userId);

    return { success: true, message: "Request approved successfully" };
  }

  /**
   * Reject a join request
   */
  async rejectJoinRequest(
    requestId: { classroomId: number; userId: number },
    adminId: number
  ) {
    const { classroomId, userId } = requestId;

    // Check if the classroom exists
    const classroom = await this.classroomRepository.findClassroomById(classroomId);
    if (!classroom) {
      throw new NotFoundError("Classroom");
    }

    // Check if user has permission
    if (classroom.ownerId !== adminId) {
      throw new AuthorizationError("Only the owner can reject requests");
    }

    // Delete the pending request
    const result = await this.membershipRepository.deletePendingMembership(
      classroomId,
      userId
    );

    if (result === 0) {
      throw new NotFoundError("Membership request");
    }

    return { success: true, message: "Request rejected successfully" };
  }

  /**
   * Cancel a pending join request (by the requester)
   */
  async cancelJoinRequest(
    requestId: { classroomId: number; userId: number },
    requestUserId: number
  ) {
    const { classroomId, userId } = requestId;

    // Ensure the user is canceling their own request
    if (userId !== requestUserId) {
      throw new AuthorizationError("You can only cancel your own requests");
    }

    // Delete the pending request
    const result = await this.membershipRepository.deletePendingMembership(
      classroomId,
      userId
    );

    if (result === 0) {
      throw new NotFoundError("Membership request");
    }

    return { success: true, message: "Request canceled successfully" };
  }

  /**
   * Leave a classroom
   */
  async leaveClassroom(classroomId: number, userId: number) {
    // Check if the classroom exists
    const classroom = await this.classroomRepository.findClassroomById(classroomId);
    if (!classroom) {
      throw new NotFoundError("Classroom");
    }

    // Check if stream channel exists
    if (!classroom.getStreamChannelId) {
      throw new ApplicationError("Classroom chat channel not available", 500);
    }

    // Check if user is the owner
    if (classroom.ownerId === userId) {
      throw new AuthorizationError("Owners cannot leave their own classroom");
    }

    // Leave the classroom
    const result = await this.membershipRepository.leaveClassroom(classroomId, userId);

    if (!result.success) {
      throw new ApplicationError(result.message, 400);
    }

    // Remove user from stream channel
    await removeUserFromStreamChannel(classroom.getStreamChannelId, userId);

    return { success: true, message: "Successfully left the classroom" };
  }

  /**
   * Remove a member from a classroom (admin operation)
   */
  async removeMember(classroomId: number, memberId: number, adminId: number) {
    // Check if the classroom exists
    const classroom = await this.classroomRepository.findClassroomById(classroomId);
    if (!classroom) {
      throw new NotFoundError("Classroom");
    }

    // Check if stream channel exists
    if (!classroom.getStreamChannelId) {
      throw new ApplicationError("Classroom chat channel not available", 500);
    }

    // Check if user has permission
    if (classroom.ownerId !== adminId) {
      throw new AuthorizationError("Only the owner can remove members");
    }

    // Check if the member to be removed is the owner
    if (memberId === classroom.ownerId) {
      throw new AuthorizationError("Cannot remove the classroom owner");
    }

    // Remove the member
    const result = await this.membershipRepository.deleteClassroomMember(
      classroomId,
      memberId,
      adminId
    );

    if (result === 0) {
      throw new NotFoundError("Member");
    }

    // Remove user from stream channel
    await removeUserFromStreamChannel(classroom.getStreamChannelId, memberId);

    return { success: true, message: "Member removed successfully" };
  }
}
