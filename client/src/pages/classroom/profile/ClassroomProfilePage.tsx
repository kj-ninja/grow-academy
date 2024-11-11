import { LoaderFunctionArgs } from "react-router-dom";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { queryClient } from "@/services/ReactQuery";
import { validateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { ClassroomGuestView } from "@/features/classroom/components/ClassroomGuestView";
import { ClassroomMemberView } from "@/features/classroom/components/ClassroomMemberView";

export async function loader({ params }: LoaderFunctionArgs) {
  const { handle } = validateRouteParams({ handle: z.string() }, params);

  await queryClient.fetchQuery({
    ...ClassroomQueries.details(handle),
  });

  return null;
}

export function Classroom() {
  // todo: add logic to render guest or member based on classroom policy
  const { classroom } = useClassroom();
  const { isConnected } = useClassroomPolicy(classroom);

  console.log("isConnected: ", isConnected);

  if (!isConnected) {
    return <ClassroomGuestView />;
  }

  return <ClassroomMemberView />;
}
