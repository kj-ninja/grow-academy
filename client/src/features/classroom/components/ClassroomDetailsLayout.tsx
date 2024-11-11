import { PropsWithChildren } from "react";

export function ClassroomDetailsLayout({ children }: PropsWithChildren) {
  return <div className="flex justify-center mt-20">{children}</div>;
}
