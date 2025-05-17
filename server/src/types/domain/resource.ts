export interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  // fileData omitted in domain model (binary data is an implementation detail)
  uploadedAt: Date;
  uploadedById: number;
  classroomId: number;
}
