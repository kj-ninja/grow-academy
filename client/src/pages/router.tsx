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
import { UserProfileErrorElement } from "@/features/user/components/UserProfileErrorElement";
import { AppHeader } from "@/components/layout/headers/AppHeader";
import { CurrentUserGuard } from "@/features/user/components/CurrentUserGuard";
import { WelcomePage } from "@/pages/auth/WelcomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ClassroomProfileErrorElement } from "@/features/classroom/components/ClassroomProfileErrorElement";
import { ClassroomGuard } from "@/features/classroom/components/ClassroomGuard";
import { ClassroomLayout } from "@/features/classroom/components/ClassroomLayout";
import { loader as userProfileLoader } from "@/pages/loaders/userProfilePageLoader";
import { loader as classroomProfileLoader } from "@/pages/loaders/classroomProfilePageLoader";
import { ClassroomOwnerGuard } from "@/features/classroom/components/ClassroomOwnerGuard";

const OnboardingPage = () => import("./user/OnboardingPage");
const ClassroomListPage = () => import("./classroom/ClassroomListPage");
const UserProfilePage = () => import("./user/profile/UserProfilePage");
const UserSettingsEditPage = () => import("./user/settings/UserSettingsPage");
const ClassroomProfilePage = () =>
  import("./classroom/profile/ClassroomProfilePage");
const ClassroomSettingsEditPage = () =>
  import("./classroom/settings/ClassroomSettingsPage");

export const RouterProvider = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<RootErrorBoundary />}>
        {/*Public routes - Auth flow */}
        <Route element={<AppFrame header={<AuthHeader />} />}>
          <Route path="/auth" element={<UnAuthenticationGuard />}>
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/*Public route - Onboarding*/}
          <Route element={<AuthenticationGuard />}>
            <Route path="onboarding" lazy={OnboardingPage} />
          </Route>
        </Route>

        {/*Private routes*/}
        <Route element={<AppFrame header={<AppHeader />} />}>
          <Route element={<AuthenticationGuard />}>
            <Route element={<ActiveUserGuard />}>
              {/*Home page*/}
              <Route index lazy={ClassroomListPage} />
              {/*User profile*/}
              <Route errorElement={<UserProfileErrorElement />}>
                <Route
                  path="user/:username"
                  lazy={UserProfilePage}
                  loader={userProfileLoader}
                />
                <Route element={<CurrentUserGuard />}>
                  <Route
                    path="user/:username/settings/:edit"
                    lazy={UserSettingsEditPage}
                  />
                </Route>
              </Route>
              {/*Classrooms*/}
              <Route
                element={<ClassroomGuard />}
                errorElement={<ClassroomProfileErrorElement />}
              >
                <Route path="classroom/:handle" element={<ClassroomLayout />}>
                  <Route
                    index
                    lazy={ClassroomProfilePage}
                    loader={classroomProfileLoader}
                  />
                </Route>
                <Route element={<ClassroomOwnerGuard />}>
                  <Route
                    path="classroom/:handle/settings/edit"
                    lazy={ClassroomSettingsEditPage}
                  />
                </Route>
              </Route>
              {/*Fallback*/}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Route>
      </Route>,
    ),
  );

  return <RouterProviderDom router={router} />;
};
