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
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useState } from "react";
import { CreateClassroomModal } from "@/features/classroom/components/CreateClassroomModal";
import { Text } from "@/components/ui/Text/Text";

export const AppHeader = () => {
  const { currentUser } = useCurrentUser();
  const { logout } = useAuthState();
  const { image } = useBinaryImage(currentUser?.avatarImage);

  const [isCreateClassroomModalOpen, setIsCreateClassroomModalOpen] =
    useState(false);

  const navigate = useNavigate();

  return (
    <header className="w-full border-b-2 bg-white">
      <div className="w-full max-w-6xl mx-auto flex justify-between p-4">
        <Link to="/" className="flex flex-row items-center">
          <Text type="h1" className="hover:opacity-80">
            <span className="text-primary">Grow</span>{" "}
            <span className="text-secondary">Academy</span>
          </Text>
        </Link>

        <nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer" tabIndex={0}>
                <AvatarImage
                  src={image}
                  alt="User profile image"
                  className="hover:opacity-80"
                />
                <AvatarFallback type="user" />
              </Avatar>
            </DropdownMenuTrigger>

            {/*todo: add dropdown menu icons and fallback icon*/}
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => navigate(`/user/${currentUser?.username}`)}
                >
                  Profile
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/user/${currentUser?.username}/settings/profile`)
                  }
                >
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsCreateClassroomModalOpen(true)}
              >
                Create Classroom
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

      {isCreateClassroomModalOpen && (
        <CreateClassroomModal
          isOpen={isCreateClassroomModalOpen}
          setIsOpen={setIsCreateClassroomModalOpen}
        />
      )}
    </header>
  );
};
