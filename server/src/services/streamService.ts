import streamClient from "@config/streamChat";

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

  await channel.create();
  return channel;
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
