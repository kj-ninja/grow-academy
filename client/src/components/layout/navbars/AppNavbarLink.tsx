import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { useBinaryImage, BinaryImage } from "@/hooks/useBinaryImage";

interface AppNavbarLinkProps {
  path: string;
  avatarImage?: BinaryImage;
}

export function AppNavbarLink({ path, avatarImage }: AppNavbarLinkProps) {
  const { image } = useBinaryImage(avatarImage);

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "hover:shadow-appNavbarLink flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent",
          isActive && "!shadow-appNavbarLinkActive"
        )
      }
    >
      {image ? (
        <img src={image} alt="bgImg" className="h-full w-full object-cover" />
      ) : (
        // TODO: replace temporary fallback with a proper fallback
        <Image className="text-black" />
      )}
    </NavLink>
  );
}
