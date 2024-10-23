import { Link, NavLink } from "react-router-dom";
import { useAuthState } from "@/features/auth/stores/authStore";
import { Button } from "@/components/ui/Button";

export const AuthHeader = () => {
  const { status, logout } = useAuthState();

  return (
    <header className="w-full border-b-2">
      <div className="w-full max-w-5xl mx-auto flex justify-between p-4">
        <Link to="/" className="flex flex-row items-center">
          <h1>Grow Academy</h1>
        </Link>

        <nav>
          <ul className="flex gap-2">
            {status === "authenticated" && (
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            )}
            {status === "unauthenticated" && (
              <>
                <NavLink to={"/auth/login"}>Login</NavLink>
                <NavLink to={"/auth/register"}>Register</NavLink>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
