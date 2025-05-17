import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { ImageMinus, ImagePlus, User } from "lucide-react";

interface AvatarImageProps {
  onChange?: (e: File) => void;
  image: string | undefined;
  setImage: (image: string | undefined) => void;
  onImageRemove?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const AvatarImage = ({
  onChange,
  image,
  setImage,
  onImageRemove,
  isLoading,
  className,
}: AvatarImageProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  const changeAvatarImage = !!onChange;

  return (
    <div
      className={cn(
        "bg-backgroundSecondary group absolute bottom-[-32px] left-6 h-[64px] w-[64px] rounded-full border-2 border-white",
        className
      )}
    >
      {changeAvatarImage && (
        <>
          {image ? (
            <div
              role="button"
              tabIndex={0}
              onClick={onImageRemove}
              className="bg-primary absolute bottom-[-8px] right-[-6px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 hover:opacity-80"
            >
              <ImageMinus width={18} />
            </div>
          ) : (
            <>
              <User className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
              <Label
                htmlFor="avatar-image-upload"
                className="bg-primary absolute bottom-[-8px] right-[-6px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 hover:opacity-80"
              >
                <ImagePlus width={18} />

                <input
                  id="avatar-image-upload"
                  type="file"
                  name="myAvatarImage"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Label>
            </>
          )}
        </>
      )}
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        image && (
          <img src={image} alt="" className="h-full w-full rounded-full object-center" />
        )
      )}
    </div>
  );
};
