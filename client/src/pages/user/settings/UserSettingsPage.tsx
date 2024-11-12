import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { Text } from "@/components/ui/Text/Text";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

function UserSettingsPage() {
  return (
    <div className="flex flex-col max-w-3xl w-full mx-auto mt-8 gap-4">
      <Text type="h1">User Settings</Text>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UpdateUserProfileForm withBottomSheet />
        </TabsContent>

        <TabsContent value="classrooms">
          <div>Classrooms</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Component = UserSettingsPage;
