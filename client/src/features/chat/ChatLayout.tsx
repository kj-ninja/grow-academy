import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import type { Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";
import "./styles.css";

export function ChatLayout() {
  const { currentUser } = useCurrentUser();
  const { classroom } = useClassroom();

  const [channel, setChannel] = useState<StreamChannel>();

  const client = useCreateChatClient({
    apiKey: import.meta.env.VITE_CHAT_API_KEY as string,
    tokenOrProvider: currentUser!.streamToken,
    userData: { id: currentUser!.id.toString() },
  });

  useEffect(() => {
    if (!client) return;
    const channel = client.channel("messaging", classroom.handle);
    setChannel(channel);
  }, [client, classroom.handle]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <div className="mb-10">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
