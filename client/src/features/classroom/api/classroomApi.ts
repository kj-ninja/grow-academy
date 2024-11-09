import { ApiClient } from "@/services/ApiClient";

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
};
