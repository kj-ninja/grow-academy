import { Outlet, ScrollRestoration } from "react-router-dom";

interface AppFrameProps {
  header: React.ReactNode;
  children?: React.ReactNode;
  navbar?: React.ReactNode;
}

export const AppFrame = ({ header, children, navbar }: AppFrameProps) => {
  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />
      {header}
      <main className="min-h-[100vh] flex flex-row">
        {navbar}
        {children ?? <Outlet />}
      </main>
    </>
  );
};
