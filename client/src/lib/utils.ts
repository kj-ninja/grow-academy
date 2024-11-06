import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function appendImageToFormData(
  formData: FormData,
  fieldName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any,
  currentImageData?: number[],
) {
  if (image instanceof File) {
    formData.append(fieldName, image);
  } else if (image === null) {
    formData.append(fieldName, "");
  } else if (currentImageData) {
    const blob = new Blob([new Uint8Array(currentImageData)], {
      type: "image/jpeg",
    });
    formData.append(fieldName, blob, `${fieldName}.jpg`);
  }
}
