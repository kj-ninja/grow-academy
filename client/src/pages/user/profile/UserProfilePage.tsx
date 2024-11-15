import { UserProfile } from "@/features/user/components/UserProfile";
import { ClassroomWebSocketListener } from "@/features/classroom/websockets/ClassroomWebSocketListener";

function UserProfilePage() {
  return (
    <>
      <UserProfile />
      {/*todo: think to use it globally*/}
      <ClassroomWebSocketListener />
    </>
  );
}

export const Component = UserProfilePage;
