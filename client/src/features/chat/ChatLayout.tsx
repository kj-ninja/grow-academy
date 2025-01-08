import { Chat, useCreateChatClient } from "stream-chat-react";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

export function ChatLayout() {
  const { currentUser } = useCurrentUser();

  console.log("import.meta.env.CHAT_API_KEY: ", import.meta.env.CHAT_API_KEY);

  const client = useCreateChatClient({
    apiKey: import.meta.env.CHAT_API_KEY,
    tokenOrProvider: currentUser!.streamToken,
    userData: { id: currentUser!.id.toString() },
  });

  if (!client) return <div>Setting up client & connection...</div>;

  return <Chat client={client}>Chat with client is ready!</Chat>;
}
