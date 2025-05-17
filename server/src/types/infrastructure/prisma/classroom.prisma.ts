import type { Prisma } from "@prisma/client";

/**
 * Classroom with owner data
 */
export type ClassroomWithOwner = Prisma.ClassroomGetPayload<{
  include: { owner: true };
}>;

/**
 * Classroom with all related data
 */
export type ClassroomWithDetails = Prisma.ClassroomGetPayload<{
  include: {
    owner: true;
    members: {
      include: {
        user: true;
      };
    };
    _count: {
      select: { members: true };
    };
  };
}>;

/**
 * Pagination and filter options for finding classrooms
 */
export interface ClassroomQueryOptions {
  page?: number;
  limit?: number;
  ownerId?: number;
  searchTerm?: string;
  tags?: string[];
}
