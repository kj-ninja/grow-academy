import React from "react";
import { Input } from "@/components/ui/Input";
import Text from "@/components/ui/Text/Text";
import { Spinner } from "@/components/ui/Spinner";
import { useInputError } from "@/hooks/useInputError";

// todo: extract input types
interface InputWithAsyncValidationProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isCheckError?: boolean;
  iconRight?: React.ReactNode;
  isLoading: boolean;
  isValid: boolean;
  validMessage: string;
}

export const InputWithAsyncValidation = React.forwardRef<
  HTMLInputElement,
  InputWithAsyncValidationProps
>(({ isLoading, isValid, validMessage, isCheckError, name, ...props }, ref) => {
  let iconRight = null;
  let successClass = "";

  const error = useInputError(name);

  if (isLoading) {
    iconRight = (
      <div className="right-4 w-4 h-4 rounded-full overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isValid && !error) {
    iconRight = (
      <img
        src="/verified-mark.svg"
        alt="Success"
        className="absolute right-[14px] top-[14px]"
      />
    );
    successClass = "border border-success";
  }

  if (isCheckError) {
    iconRight = (
      <img
        src="/error-icon.svg"
        alt="Error"
        className="absolute right-[14px] top-[14px]"
      />
    );
  }

  return (
    <>
      <Input
        {...props}
        iconRight={iconRight}
        className={successClass}
        ref={ref}
        name={name}
      />
      {isValid && !error && (
        <Text type="bodyXSmallBold" className="!text-success">
          {validMessage}
        </Text>
      )}
    </>
  );
});
