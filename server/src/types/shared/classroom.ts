// Shared types - subset of domain that's relevant across client and server
export interface ClassroomDto {
  id: number;
  classroomName: string;
  handle: string;
  description: string | null;
  accessType: "Public" | "Private";
  ownerId: number;
  ownerUsername: string;
  memberCount: number;
  isLive: boolean;
  tags: string[];
  // Timestamps as ISO strings for JSON compatibility
  createdAt: string;
  updatedAt: string;
}

export interface ClassroomListDto {
  classrooms: ClassroomDto[];
  total: number;
  page: number;
  pageSize: number;
}

// Shared validation rules (can be imported by zod schemas)
export const CLASSROOM_VALIDATION = {
  NAME_MIN: 3,
  NAME_MAX: 50,
  HANDLE_MIN: 3,
  HANDLE_MAX: 30,
  HANDLE_PATTERN: /^[a-zA-Z0-9_]+$/,
};
