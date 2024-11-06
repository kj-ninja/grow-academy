import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { ImageMinus, ImagePlus } from "lucide-react";

interface BackgroundImageProps {
  onChange?: (e: File) => void;
  image: string | undefined;
  setImage: (image: string | undefined) => void;
  onImageRemove?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const BackgroundImage = ({
  onChange,
  image,
  setImage,
  onImageRemove,
  isLoading,
  className,
}: BackgroundImageProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  const handleImageRemove = () => {
    setImage(undefined);
    onImageRemove?.();
  };

  const changeBackgroundImage = !!onChange;

  return (
    <div className={cn("w-full relative bg-primary/10", className)}>
      {changeBackgroundImage && (
        <>
          {image ? (
            <div
              role="button"
              tabIndex={0}
              onClick={handleImageRemove}
              className="p-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer"
            >
              <ImageMinus width={18} />
            </div>
          ) : (
            <Label
              htmlFor="background-image-upload"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer"
            >
              <ImagePlus width={18} />

              <input
                id="background-image-upload"
                type="file"
                name="myBackgroundImage"
                className="hidden"
                onChange={handleImageChange}
              />
            </Label>
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
            className="w-full h-full object-cover object-center"
          />
        )
      )}
    </div>
  );
};
