import { ClassroomAccessType } from "../../domain/classroom";

/**
 * Classroom response DTO
 * What the API returns about a classroom
 */
export interface ClassroomResponse {
  id: number;
  classroomName: string;
  handle: string;
  description: string | null;
  accessType: ClassroomAccessType;
  ownerId: number;
  ownerUsername: string;
  avatarImageUrl: string | null;
  backgroundImageUrl: string | null;
  tags: string[];
  membersCount: number;
  isMember: boolean;
  isPendingRequest: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Classrooms list response DTO
 */
export interface ClassroomListResponse {
  classrooms: ClassroomResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Membership action response
 */
export interface MembershipActionResponse {
  success: boolean;
  message: string;
  status?: string;
}
