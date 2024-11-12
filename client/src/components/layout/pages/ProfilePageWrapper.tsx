import { PropsWithChildren } from "react";

export function ProfilePageWrapper({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col max-w-4xl w-full mx-auto gap-4">
      {children}
    </div>
  );
}
