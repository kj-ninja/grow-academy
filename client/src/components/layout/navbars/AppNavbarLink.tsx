import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { useBinaryImage } from "@/hooks/useBinaryImage";

// todo: move it to global types?
type BinaryImage = { data: number[]; type: "Buffer" };

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
          "w-10 h-10 rounded-2xl flex justify-center items-center overflow-hidden border-2 border-transparent hover:shadow-appNavbarLink",
          isActive && "!shadow-appNavbarLinkActive",
        )
      }
    >
      {image ? (
        <img src={image} alt="bgImg" className="w-full h-full object-cover" />
      ) : (
        // TODO: replace temporary fallback with a proper fallback
        <Image className="text-black" />
      )}
    </NavLink>
  );
}
