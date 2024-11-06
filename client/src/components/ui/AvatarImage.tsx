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
        "absolute w-[64px] h-[64px] left-6 bottom-[-32px] rounded-full border-2 border-white bg-background group",
        className,
      )}
    >
      {changeAvatarImage && (
        <>
          {image ? (
            <div
              role="button"
              tabIndex={0}
              onClick={onImageRemove}
              className="p-0 absolute right-[-6px] bottom-[-8px] h-8 w-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer"
            >
              <ImageMinus width={18} />
            </div>
          ) : (
            <>
              <User className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <Label
                htmlFor="avatar-image-upload"
                className="p-0 absolute right-[-6px] bottom-[-8px] h-8 w-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer"
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
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        image && (
          <img
            src={image}
            alt=""
            className="w-full h-full object-center rounded-full"
          />
        )
      )}
    </div>
  );
};
