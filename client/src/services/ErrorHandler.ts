import axios from "axios";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface ErrorHandlerOptions<T extends FieldValues> {
  error: unknown;
  form?: UseFormReturn<T>;
  onToast?: () => void;
}

class ErrorHandler {
  static handle<T extends FieldValues>({ error, form, onToast }: ErrorHandlerOptions<T>) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (typeof data.fields === "object") {
        Object.entries(data.fields).forEach(([field, message]) => {
          form?.setError(field as Path<T>, {
            type: "manual",
            message: String(message),
          });
        });
        return;
      }

      if (data.message) {
        form?.setError("root", {
          type: "manual",
          message: data.message,
        });
        return;
      }
    }

    if (error instanceof Error) {
      form?.setError("root", {
        type: "manual",
        message: String(error.message),
      });
      return;
    }

    onToast?.();
    return;
  }
}

export default ErrorHandler;
