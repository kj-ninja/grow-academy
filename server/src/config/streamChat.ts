import { StreamChat } from "stream-chat";

const streamClient = StreamChat.getInstance(
  process.env.GETSTREAM_API_KEY!,
  process.env.GETSTREAM_API_SECRET,
);

export default streamClient;
