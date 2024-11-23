import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { Text } from "@/components/ui/Text/Text";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useNavigate } from "react-router-dom";
import { UserSettingsClassrooms } from "@/features/user/components/settings/UserSettingsClassrooms";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

function UserSettingsPage() {
  const { edit } = useValidateRouteParams({
    edit: z.enum(["profile", "classrooms"]),
  });
  const { currentUser } = useCurrentUser();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col max-w-3xl w-full mx-auto mt-8 gap-4">
      <Text type="h1">User Settings</Text>

      <Tabs
        value={edit}
        onValueChange={(tab) =>
          navigate(`/user/${currentUser?.username}/settings/${tab}`)
        }
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mb-[120px]">
          {/*todo: remove that props */}
          <UpdateUserProfileForm withBottomSheet />
        </TabsContent>

        <TabsContent value="classrooms">
          <UserSettingsClassrooms />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Component = UserSettingsPage;
