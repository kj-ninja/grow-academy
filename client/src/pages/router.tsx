import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider as RouterProviderDom,
} from "react-router-dom";
import { RootErrorBoundary } from "@/pages/RootErrorBoundary";
import { AppFrame } from "@/components/layout/frames/AppFrame";
import { AuthHeader } from "@/components/layout/headers/AuthHeader";
import { NotFoundPage } from "@/pages/NotFoundPage";
import {
  AuthenticationGuard,
  UnAuthenticationGuard,
} from "@/features/auth/components/AuthenticationGuard";
import { ActiveUserGuard } from "@/features/user/components/ActiveUserGuard";
import { UserProfileErrorBoundary } from "@/features/user/components/UserProfileErrorBoundary";
import { AppHeader } from "@/components/layout/headers/AppHeader";
import { CurrentUserGuard } from "@/features/user/components/CurrentUserGuard";
import { WelcomePage } from "@/pages/auth/WelcomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

// Lazy-loaded routes
const OnboardingPage = () => import("./user/OnboardingPage");
const HomePage = () => import("./HomePage");
const UserProfilePage = () => import("./user/profile/UserProfilePage");
const UserSettingsEditPage = () => import("./user/settings/UserSettingsPage");

export const RouterProvider = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<RootErrorBoundary />}>
        {/* Authentication */}
        <Route element={<AppFrame header={<AuthHeader />} />}>
          <Route path="/auth" element={<UnAuthenticationGuard />}>
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Main App Layout with Header */}
        <Route element={<AppFrame header={<AppHeader />} />}>
          <Route element={<AuthenticationGuard />}>
            <Route path="/" lazy={HomePage} />
            {/* User Profile */}
            <Route
              element={<ActiveUserGuard />}
              errorElement={<UserProfileErrorBoundary />}
            >
              <Route path="user/:username" lazy={UserProfilePage} />
              <Route element={<CurrentUserGuard />}>
                <Route
                  path="user/:username/settings/edit"
                  lazy={UserSettingsEditPage}
                />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>,
    ),
  );

  return <RouterProviderDom router={router} />;
};
