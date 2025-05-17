import { PropsWithChildren } from "react";

export function ProfilePageWrapper({ children }: PropsWithChildren) {
  return <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">{children}</div>;
}
