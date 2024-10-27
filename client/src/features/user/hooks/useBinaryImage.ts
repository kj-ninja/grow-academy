import { useEffect, useState } from "react";

type BinaryImage = { data: number[]; type: "Buffer" };

function isBinaryAvatarImage(
  image: string | BinaryImage,
): image is BinaryImage {
  return typeof image === "object" && "data" in image;
}

export const useBinaryImage = (image: string | BinaryImage) => {
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (image && isBinaryAvatarImage(image)) {
      const binary = new Uint8Array(image.data);
      const base64String = btoa(
        binary.reduce((data, byte) => data + String.fromCharCode(byte), ""),
      );
      setImagePreview(`data:image/jpeg;base64,${base64String}`);
    }
  }, [image]);

  return {
    image: imagePreview,
    setImage: setImagePreview,
  };
};
