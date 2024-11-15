import { ApiClient } from "@/services/ApiClient";
import { User } from "@/features/auth/stores/authStore";

// todo: investigate about members array and remove it from the response
// todo: remove ownerId
export interface ClassroomResponse {
  id: number;
  classroomName: string;
  handle: string;
  description?: string;
  accessType: "Public" | "Private";
  avatarImage?: { data: number[]; type: "Buffer" };
  backgroundImage?: { data: number[]; type: "Buffer" };
  getStreamChannelId: string;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  owner: Pick<
    User,
    "id" | "username" | "firstName" | "lastName" | "avatarImage"
  >;
  tags: string[];
}

export interface ClassroomWithDetailsResponse extends ClassroomResponse {
  isMember: boolean;
  isPendingRequest: boolean;
}

export const classroomApi = {
  createClassroom: async (data: FormData) => {
    const response = await ApiClient.post("/classroom", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
  checkClassroomName: async (name: string) => {
    const response = await ApiClient.get(`/classroom/check-name/${name}`);
    return response.data;
  },
  checkClassroomHandle: async (handle: string) => {
    const response = await ApiClient.get(`/classroom/check-handle/${handle}`);
    return response.data;
  },
  getClassroomDetails: async (handle: string) => {
    const response = await ApiClient.get<ClassroomWithDetailsResponse>(
      `/classroom/${handle}`,
    );
    return response.data;
  },
  getClassroomList: async ({
    page = 1,
    limit = 10,
    filterByOwner = false,
  }: {
    page?: number;
    limit?: number;
    filterByOwner?: boolean;
  }) => {
    const response = await ApiClient.get(
      `/classroom?page=${page}&limit=${limit}&owner=${filterByOwner}`,
    );
    return response.data;
  },
  joinClassroom: async (classroomId: number) => {
    const response = await ApiClient.post(`/classroom/${classroomId}/join`);
    return response.data;
  },
  cancelJoinClassroom: async (classroomId: number) => {
    const response = await ApiClient.delete(
      `/classroom/${classroomId}/join-cancel`,
    );
    return response.data;
  },
  leaveClassroom: async (classroomId: number) => {
    const response = await ApiClient.post(`/classroom/${classroomId}/leave`);
    return response.data;
  },
};
