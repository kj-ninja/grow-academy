import streamClient from "config/streamChat";
import type { User } from "@prisma/client";
import { ApplicationError } from "../../utils/errors";

/**
 * Add a user to a stream channel
 * @param channelId The ID of the channel to add the user to
 * @param userId The ID of the user to add
 */
export const addUserToStreamChannel = async (channelId: string, userId: number) => {
  try {
    const channel = streamClient.channel("messaging", channelId);
    await channel.addMembers([userId.toString()]);
  } catch (error: unknown) {
    console.error(`Error adding user ${userId} to channel ${channelId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ApplicationError(`Failed to add user to channel: ${errorMessage}`);
  }
};

/**
 * Remove a user from a stream channel
 * @param channelId The ID of the channel to remove the user from
 * @param userId The ID of the user to remove
 */
export const removeUserFromStreamChannel = async (channelId: string, userId: number) => {
  try {
    const channel = streamClient.channel("messaging", channelId);
    await channel.removeMembers([userId.toString()]);
  } catch (error: unknown) {
    console.error(`Error removing user ${userId} from channel ${channelId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ApplicationError(`Failed to remove user from channel: ${errorMessage}`);
  }
};

/**
 * Create a new stream channel for a classroom
 * @param channelId The ID to assign to the channel
 * @param name The name of the classroom/channel
 * @param userId The ID of the user creating the channel
 */
export const createStreamChannel = async (
  channelId: string,
  name: string,
  userId: number
) => {
  try {
    const channel = streamClient.channel("messaging", channelId, {
      name: `Classroom: ${name}`,
      members: [userId.toString()],
      created_by_id: userId.toString(),
    });

    await channel.create();
    return channel;
  } catch (error: unknown) {
    console.error("Error creating channel:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ApplicationError(`Failed to create channel: ${errorMessage}`);
  }
};

/**
 * Generate a Stream chat token for a user
 */
export const generateStreamToken = (userId: number) => {
  return streamClient.createToken(userId.toString());
};

/**
 * Update a user's information in Stream
 */
export const updateStreamUser = async (updatedUser: Omit<User, "password">) => {
  const name =
    `${updatedUser.firstName ?? ""} ${updatedUser.lastName ?? ""}`.trim() || "User";

  try {
    await streamClient.upsertUsers([
      {
        id: updatedUser.id.toString(),
        username: updatedUser.username,
        name,
      },
    ]);
  } catch (error: unknown) {
    console.error("Error updating Stream user:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ApplicationError(`Failed to update Stream user: ${errorMessage}`);
  }
};
