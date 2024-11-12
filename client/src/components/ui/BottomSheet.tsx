import { PropsWithChildren } from "react";

export function BottomSheet({ children }: PropsWithChildren) {
  return (
    <div className="fixed inset-x-0 bottom-0 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-white">
      <div className="flex items-center justify-center p-5 gap-4">
        {children}
      </div>
    </div>
  );
}
