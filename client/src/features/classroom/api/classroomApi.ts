import { ApiClient } from "@/services/ApiClient";

export interface ClassroomResponse {
  id: number;
  classroomName: string;
  handle: string;
  description?: string;
  accessType: string;
  avatarImage?: string;
  backgroundImage?: string;
  getStreamChannelId: string;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  ownerId: number;
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
  joinClassroom: async (classroomId: string) => {
    const response = await ApiClient.post(`/classroom/${classroomId}/join`);
    return response.data;
  },
};
