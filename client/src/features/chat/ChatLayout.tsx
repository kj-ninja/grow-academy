import { Chat, useCreateChatClient } from "stream-chat-react";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

export function ChatLayout() {
  const { currentUser } = useCurrentUser();
  console.log("currentUser:", currentUser);

  const userToken = localStorage.getItem("token");

  const client = useCreateChatClient({
    apiKey: import.meta.env.CHAT_API_KEY,
    tokenOrProvider: userToken,
    userData: { id: currentUser!.id.toString() },
  });

  if (!client) return <div>Setting up client & connection...</div>;

  return <Chat client={client}>Chat with client is ready!</Chat>;
}
