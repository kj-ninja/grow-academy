import { LoaderFunctionArgs } from "react-router-dom";
import { validateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";
import { queryClient } from "@/services/ReactQuery";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { handle } = validateRouteParams({ handle: z.string() }, params);

  await queryClient.fetchQuery({
    ...ClassroomQueries.details(handle),
  });

  return null;
};
