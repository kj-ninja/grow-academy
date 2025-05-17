import { Params, useParams } from "react-router-dom";
import { z, type ZodRawShape, type infer as zodInfer } from "zod";

export function useValidateRouteParams<S extends ZodRawShape>(
  schema: S
): zodInfer<z.ZodObject<S>> {
  const params = useParams();
  return validateRouteParams(schema, params);
}

export function validateRouteParams<S extends ZodRawShape>(
  schema: S,
  params: Readonly<Params<string>>
): zodInfer<z.ZodObject<S>> {
  return z.object(schema).parse(params);
}
