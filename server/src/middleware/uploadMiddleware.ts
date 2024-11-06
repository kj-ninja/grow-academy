import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadMultiple = upload.fields([
  { name: "avatarImage", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
]);
