import { ClassroomAccessType } from "../../domain/classroom";

/**
 * Create classroom request DTO
 * Matches the data needed in ClassroomService.createClassroom
 */
export interface CreateClassroomRequest {
  classroomName: string;
  handle: string;
  description?: string;
  accessType?: ClassroomAccessType;
  tags?: string[];
  // Files are handled separately via multer
}

/**
 * Update classroom request DTO
 * Matches ClassroomUpdateData in your service
 */
export interface UpdateClassroomRequest {
  classroomName?: string;
  handle?: string;
  description?: string | null;
  accessType?: ClassroomAccessType;
  tags?: string[] | null;
  // Files are handled separately via multer
}

/**
 * Request to join a classroom
 */
export interface JoinClassroomRequest {
  classroomId: number;
}

/**
 * Request to handle a membership request
 */
export interface MembershipActionRequest {
  classroomId: number;
  userId: number;
}
