import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider as RouterProviderDom,
} from "react-router-dom";
import App from "@/App";
import { RootErrorBoundary } from "@/pages/RootErrorBoundary";

export const RouterProvider = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<RootErrorBoundary />}>
        <Route path="/" element={<App />}></Route>));
      </Route>
    )
  );

  return <RouterProviderDom router={router} />;
};
