import { Spinner } from "@/components/ui/Spinner";

export const FullPageLoader = ({ name }: { name?: string }) => {
  if (name) {
    // This is useful for debugging. It will help us track which component is causing the loader to show.
    console.log("> FullPageLoader <", name);
  }

  return (
    <div className="fixed top-0 w-full flex justify-center items-center h-full bg-black bg-opacity-30 z-50">
      <Spinner />
    </div>
  );
};
