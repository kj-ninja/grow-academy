import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Text } from "@/components/ui/Text/Text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { UpdateClassroomForm } from "@/features/classroom/forms/UpdateClassroomForm";
import { ClassroomSettingsMembers } from "@/features/classroom/components/settings/ClassroomSettingsMembers";
import { ClassroomSettingsPendingRequests } from "@/features/classroom/components/settings/ClassroomSettingsPendingRequests";
import { useClassroomWebSocketListener } from "@/features/classroom/websockets/useClassroomWebSocketListener";

function ClassroomSettingsPage() {
  const { edit } = useValidateRouteParams({
    edit: z.enum(["profile", "classrooms", "requests"]),
  });
  const { classroom } = useClassroom();

  const navigate = useNavigate();

  useClassroomWebSocketListener();

  // todo: make owner as a member of the classroom
  // todo: remove user from classroom with modal confirmation + revalidation
  // todo: investigate why membersCount is broken after accessType change
  // todo: add members sheet to the classroom

  // todo: reuse some code from the user profile
  // todo: add settings page wrapper?
  // todo: add fallback imgs to the classroom and user profiles
  // todo: display tags in the classroom profile and card?

  return (
    <div className="flex flex-col max-w-3xl w-full mx-auto mt-8 gap-4">
      <Text type="h1">Classroom Settings</Text>

      <Tabs
        value={edit}
        onValueChange={(tab) =>
          navigate(`/classroom/${classroom.id}/settings/${tab}`)
        }
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="classrooms">Members</TabsTrigger>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mb-[120px]">
          <UpdateClassroomForm />
        </TabsContent>
        <TabsContent value="classrooms">
          <ClassroomSettingsMembers />
        </TabsContent>
        <TabsContent value="requests">
          <ClassroomSettingsPendingRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Component = ClassroomSettingsPage;
