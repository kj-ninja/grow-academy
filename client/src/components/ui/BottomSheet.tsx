import { PropsWithChildren } from "react";

export function BottomSheet({ children }: PropsWithChildren) {
  return (
    <div className="fixed inset-x-0 bottom-0 flex h-auto flex-col rounded-t-[10px] border bg-white">
      <div className="flex items-center justify-center gap-4 p-5">{children}</div>
    </div>
  );
}
