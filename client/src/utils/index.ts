// src/utils/errorUtils.ts
import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message || error.response?.data?.error;
    return responseMessage || "Something went wrong. Please try again.";
  }
  return (error as Error).message;
};
