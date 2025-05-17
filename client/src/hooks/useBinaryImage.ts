import { useEffect, useState } from "react";

export type BinaryImage = { data: number[]; type: "Buffer" };

function isBinaryAvatarImage(image?: BinaryImage): image is BinaryImage {
  return typeof image === "object" && !!image && "data" in image;
}

export const useBinaryImage = (image?: BinaryImage) => {
  const [imagePreview, setImagePreview] = useState<string>();

  useEffect(() => {
    if (image && isBinaryAvatarImage(image)) {
      const binary = new Uint8Array(image.data);
      const base64String = btoa(
        binary.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      setImagePreview(`data:image/jpeg;base64,${base64String}`);
    }

    if (!image) {
      setImagePreview(undefined);
    }
  }, [image]);

  return {
    image: imagePreview,
    setImage: setImagePreview,
  };
};
