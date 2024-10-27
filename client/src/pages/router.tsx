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
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { WelcomePage } from "@/pages/auth/WelcomePage";
import { ActiveUserGuard } from "@/features/user/components/ActiveUserGuard";
import { UserProfileErrorBoundary } from "@/features/user/components/UserProfileErrorBoundary";

const OnboardingPage = () => import("./user/OnboardingPage");
const HomePage = () => import("./HomePage");
const UserProfilePage = () => import("./user/UserProfilePage");

export const RouterProvider = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<RootErrorBoundary />}>
        <Route element={<AppFrame header={<AuthHeader />} />}>
          {/* Auth flow */}
          <Route path="/auth" element={<UnAuthenticationGuard />}>
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/*Onboarding*/}
          <Route element={<AuthenticationGuard />}>
            <Route path="onboarding" lazy={OnboardingPage} />
          </Route>
        </Route>

        <Route element={<AppFrame header={<AuthHeader />} />}>
          {/*Private routes*/}
          <Route element={<AuthenticationGuard />}>
            <Route element={<ActiveUserGuard />}>
              <Route path="/" lazy={HomePage} />

              <Route errorElement={<UserProfileErrorBoundary />}>
                <Route path="user" lazy={UserProfilePage} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Route>
      </Route>,
    ),
  );

  return <RouterProviderDom router={router} />;
};
