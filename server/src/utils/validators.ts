import { ApplicationError } from "./errors";

export const validateHandle = (handle: string) => {
  // Check for letters, numbers, and underscores
  const isValid = /^[A-Za-z0-9_]+$/.test(handle);
  if (!isValid) {
    throw new ApplicationError(
      "Handle must only contain letters, numbers, and underscores",
      400,
    );
  }

  // Check minimum length
  if (handle.length < 2) {
    throw new ApplicationError("Handle must be at least 2 characters", 400);
  }

  // Optional: Add check for not starting with a number
  if (/^[0-9]/.test(handle)) {
    throw new ApplicationError("Handle cannot start with a number", 400);
  }
};
