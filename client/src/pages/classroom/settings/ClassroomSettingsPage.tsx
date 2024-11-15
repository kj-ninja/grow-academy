import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Text } from "@/components/ui/Text/Text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { UserSettingsClassrooms } from "@/features/user/components/settings/UserSettingsClassrooms";
import { UpdateClassroomForm } from "@/features/classroom/forms/UpdateClassroomForm";

function ClassroomSettingsPage() {
  const { edit } = useValidateRouteParams({
    edit: z.enum(["profile", "classrooms"]),
  });
  const { classroom } = useClassroom();

  const navigate = useNavigate();

  // todo: add basic settings with classroom profile and members management
  // todo: part 2: change members amount dynamically, add tags to the classroom add owner to the members list
  // todo: part 3: add members sheet to the classroom + pending members also
  // todo: part 4: add app navbar with currentUser classrooms and create classroom icon
  // todo: part add fallback imgs to the classroom and user profile also reuse some code from the user profile

  return (
    <div className="flex flex-col max-w-3xl w-full mx-auto mt-8 gap-4">
      <Text type="h1">Classroom Settings</Text>

      <Tabs
        value={edit}
        onValueChange={(tab) =>
          navigate(`/classroom/${classroom.handle}/settings/${tab}`)
        }
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="classrooms">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mb-[120px]">
          <UpdateClassroomForm />
        </TabsContent>

        <TabsContent value="classrooms">
          <div>Members</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Component = ClassroomSettingsPage;
