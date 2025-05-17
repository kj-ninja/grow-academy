import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodSchema } from "zod";

export function createFormSchema<S extends ZodSchema, T extends Zod.infer<S>>(schema: S) {
  return {
    schema,
    useForm: (formOptions: UseFormProps<T>) => {
      return useForm<T>({
        ...formOptions,
        resolver: zodResolver(schema),
      });
    },
  };
}
