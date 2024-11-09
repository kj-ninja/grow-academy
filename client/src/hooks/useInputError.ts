import { useFormContext } from "react-hook-form";

export const useInputError = (name?: string) => {
  const {
    formState: { errors },
  } = useFormContext();

  return name && errors[name as keyof typeof errors];
};
