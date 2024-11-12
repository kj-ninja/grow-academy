import { Link, NavLink } from "react-router-dom";
import { useAuthState } from "@/features/auth/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text/Text";

export const AuthHeader = () => {
  const { status, logout } = useAuthState();

  return (
    <header className="w-full border-b-2 bg-white">
      <div className="w-full max-w-6xl mx-auto flex justify-between p-4">
        <Link to="/auth" className="flex flex-row items-center">
          <Text type="h1" className="hover:opacity-80">
            <span className="text-primary">Grow</span>{" "}
            <span className="text-secondary">Academy</span>
          </Text>
        </Link>

        <nav>
          <ul className="flex gap-2">
            {status === "authenticated" ? (
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            ) : (
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
