/**
 * Core classroom entity in the domain
 */
export interface Classroom {
  id: number;
  classroomName: string;
  handle: string;
  description: string | null;
  accessType: ClassroomAccessType;
  ownerId: number;
  tags: string[];
  getStreamChannelId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Types of classroom access
 */
export enum ClassroomAccessType {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

/**
 * Classroom membership entity
 */
export interface ClassroomMembership {
  userId: number;
  classroomId: number;
  membershipStatus: MembershipStatus;
}

/**
 * Status of classroom membership
 */
export enum MembershipStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

/**
 * Domain operation parameters
 */
export interface ClassroomCreateParams {
  userId: number;
  classroomName: string;
  handle: string;
  description?: string;
  accessType?: ClassroomAccessType;
  tags?: string[];
  avatarImage?: Buffer | null;
  backgroundImage?: Buffer | null;
}

/**
 * Parameters for updating a classroom
 */
export interface ClassroomUpdateData {
  classroomName?: string;
  handle?: string;
  description?: string | null;
  accessType?: ClassroomAccessType;
  tags?: string[] | null;
  avatarImage?: Buffer | null;
  backgroundImage?: Buffer | null;
}
