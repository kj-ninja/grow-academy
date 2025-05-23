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

  // todo: extract bg-primary/20 to var
  return (
    <div className={cn("bg-primary/20 relative w-full", className)}>
      {changeBackgroundImage && (
        <>
          {image ? (
            <div
              role="button"
              tabIndex={0}
              onClick={handleImageRemove}
              className="bg-primary absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full p-0 hover:opacity-80"
            >
              <ImageMinus width={18} />
            </div>
          ) : (
            <Label
              htmlFor="background-image-upload"
              className="bg-primary absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full hover:opacity-80"
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
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        image && (
          <img src={image} alt="" className="h-full w-full object-cover object-center" />
        )
      )}
    </div>
  );
};
