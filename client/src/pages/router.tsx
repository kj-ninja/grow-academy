import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider as RouterProviderDom,
} from "react-router-dom";
import { RootErrorBoundary } from "@/pages/RootErrorBoundary";
import { AppFrame } from "@/components/layout/frames/AppFrame";
import { AuthHeader } from "@/components/layout/headers/AuthHeader";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AuthenticationGuard, UnAuthenticationGuard } from "@/features/auth/components/AuthenticationGuard";

const AuthWelcomePage = () => import("./auth/WelcomePage");

export const RouterProvider = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<RootErrorBoundary />}>
        <Route element={<AppFrame header={<AuthHeader />} />}>
          {/* Auth flow */}
          <Route path="/auth" element={<UnAuthenticationGuard />}>
            <Route index lazy={AuthWelcomePage} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<AuthenticationGuard />}>
            <Route path="*" element={<NotFoundPage />} />
            {/* Navigate to / from the old home path. */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/communities" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProviderDom router={router} />;
};
