import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "@/features/auth/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export const AppHeader = () => {
  const { user } = useAuthState();
  const { logout } = useAuthState();

  const navigate = useNavigate();

  return (
    <header className="w-full border-b-2">
      <div className="w-full max-w-5xl mx-auto flex justify-between p-4">
        <Link to="/" className="flex flex-row items-center">
          <h1>Grow Academy</h1>
        </Link>

        <nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>GA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            {/*todo: add dropdown menu icons and fallback icon*/}
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => navigate(`/user/${user?.username}`)}
                >
                  Profile
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/user/${user?.username}/settings/edit`)
                  }
                >
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => console.log("create community")}>
                Create Community
                <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => logout()}>
                Log out
                <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};
