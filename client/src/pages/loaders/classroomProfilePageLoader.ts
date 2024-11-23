import { LoaderFunctionArgs } from "react-router-dom";
import { validateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";
import { queryClient } from "@/services/ReactQuery";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = validateRouteParams({ id: z.string() }, params);

  await queryClient.fetchQuery({
    ...ClassroomQueries.details(Number(id)),
  });

  return null;
};
