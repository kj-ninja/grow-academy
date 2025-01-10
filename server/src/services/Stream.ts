import streamClient from "@config/streamChat";
import type { User } from "@prisma/client";

export const createStreamChannel = async (
  channelId: string,
  name: string,
  userId: number,
) => {
  const channel = streamClient.channel("messaging", channelId, {
    name: `Classroom: ${name}`,
    members: [userId.toString()],
    created_by_id: userId.toString(),
  });

  try {
    await channel.create();
    return channel;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};

export const addUserToStreamChannel = async (
  channelId: string,
  userId: number,
) => {
  const channel = streamClient.channel("messaging", channelId);
  await channel.addMembers([userId.toString()]);
};

export const generateStreamToken = (userId: number) => {
  return streamClient.createToken(userId.toString());
};

export const updateStreamUser = async (updatedUser: Omit<User, "password">) => {
  const name =
    `${updatedUser.firstName ?? ""} ${updatedUser.lastName ?? ""}`.trim() ||
    "User";

  console.log("Updating Stream user:", updatedUser);
  try {
    await streamClient.upsertUsers([
      {
        id: updatedUser.id.toString(),
        username: updatedUser.username,
        name,
      },
    ]);
  } catch (e) {
    console.log("Error updating Stream user:", e);
  }
};
