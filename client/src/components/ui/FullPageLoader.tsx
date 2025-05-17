import { Spinner } from "@/components/ui/Spinner";

export const FullPageLoader = ({ name }: { name?: string }) => {
  // todo: add local state / steTimout to show loader with delay
  if (name) {
    // This is useful for debugging. It will help us track which component is causing the loader to show.
    console.log("> FullPageLoader <", name);
  }

  return (
    <div className="fixed top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-30">
      <Spinner />
    </div>
  );
};
