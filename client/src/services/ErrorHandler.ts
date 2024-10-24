import axios from "axios";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

// todo: add toast notifications
class ErrorHandler {
  static handle<T extends FieldValues>(error: unknown, form?: UseFormReturn<T>) {
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

    console.log(error);
    form?.setError("root", {
      type: "manual",
      message: "Something went wrong",
    });
    return;
  }
}

export default ErrorHandler;
