import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

interface AppFrameProps {
  header: React.ReactNode;
  children?: React.ReactNode;
}

export const AppFrame = ({ header, children }: AppFrameProps) => {
  const navigation = useNavigation();

  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />
      <div className="min-h-[100vh]">
        {header}
        <main>
          {navigation.state === "loading" && <FullPageLoader />}
          {children ?? <Outlet />}
        </main>
      </div>
    </>
  );
};
