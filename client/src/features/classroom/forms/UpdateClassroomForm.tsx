import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/Form";
import {
  CreateClassroomFormSchema,
  CreateClassroomFormValues,
} from "@/features/classroom/forms/CreateClassroomForm.schema";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { TagsInput } from "@/components/ui/TagsInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { appendImageToFormData } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { useUpdateClassroomMutation } from "@/features/classroom/api/mutations";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { isEqual } from "lodash";

export function UpdateClassroomForm() {
  const { classroom } = useClassroom();
  const { image: avatarImage, setImage: setAvatarImage } = useBinaryImage(
    classroom.avatarImage
  );
  const { image: backgroundImage, setImage: setBackgroundImage } = useBinaryImage(
    classroom.backgroundImage
  );

  const updateClassroomMutation = useUpdateClassroomMutation();
  const navigate = useNavigate();

  const { toast } = useToast();

  const form = CreateClassroomFormSchema.useForm({
    defaultValues: {
      classroomName: classroom.classroomName,
      handle: classroom.handle,
      description: classroom.description || "",
      tags: classroom.tags,
      accessType: classroom.accessType,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (values: CreateClassroomFormValues) => {
    const formData = new FormData();

    formData.append("classroomName", values.classroomName);
    formData.append("handle", classroom.handle);
    formData.append("description", values.description || "");
    formData.append("accessType", values.accessType);

    if (!isEqual(values.tags, classroom.tags)) {
      formData.append("tags", JSON.stringify(values.tags || []));
    }

    appendImageToFormData(
      formData,
      "avatarImage",
      values.avatarImage,
      classroom.avatarImage?.data
    );
    appendImageToFormData(
      formData,
      "backgroundImage",
      values.backgroundImage,
      classroom.backgroundImage?.data
    );

    try {
      const response = await updateClassroomMutation.mutateAsync({
        id: classroom.id,
        data: formData,
      });
      navigate(`/classroom/${response.id}`);
    } catch (error) {
      // todo: add generic error handler under the field
      toast({
        title: "Error updating classroom",
        description: "An error occurred while updating the classroom.",
      });
      console.error("Error updating classroom:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="relative">
          <Controller
            name="backgroundImage"
            control={form.control}
            render={({ field: { onChange } }) => (
              <BackgroundImage
                onChange={onChange}
                image={backgroundImage}
                setImage={setBackgroundImage}
                onImageRemove={() => {
                  setBackgroundImage(undefined);
                  form.setValue("backgroundImage", null);
                }}
                className="h-48"
              />
            )}
          />
          <Controller
            name="avatarImage"
            control={form.control}
            render={({ field: { onChange } }) => (
              <AvatarImage
                onChange={onChange}
                image={avatarImage}
                setImage={setAvatarImage}
                onImageRemove={() => {
                  setAvatarImage(undefined);
                  form.setValue("avatarImage", null);
                }}
              />
            )}
          />
        </div>

        <div className="mt-8 px-6 pb-2 pt-6">
          <FormField
            control={form.control}
            name="classroomName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom Name</FormLabel>
                <FormControl>
                  <Input placeholder="Classroom Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom Handle</FormLabel>
                <FormControl>
                  <Input placeholder="Classroom Handle" {...field} disabled />
                </FormControl>
                <FormDescription>Cannot be changed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your Classroom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value || []}
                    onChange={(newTags) => form.setValue("tags", newTags)}
                    placeholder="Add tags"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                    <FormItem className="mb-1 flex items-start gap-3">
                      <FormControl>
                        <RadioGroupItem value="Private" />
                      </FormControl>
                      <div className="flex flex-col">
                        <FormLabel className="!text-bodyBold">Private</FormLabel>
                        <FormDescription>
                          Members requires approval to join.
                        </FormDescription>
                      </div>
                    </FormItem>

                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <RadioGroupItem value="Public" />
                      </FormControl>
                      <div className="flex flex-col">
                        <FormLabel className="!text-bodyBold">Public</FormLabel>
                        <FormDescription>Any user is free to join.</FormDescription>
                      </div>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormRootError />

          <BottomSheet>
            <Button
              type="submit"
              className="w-[120px]"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Submit
            </Button>
            <Button
              type="button"
              className="w-[120px]"
              variant="outline"
              onClick={() => navigate(`/classroom/${classroom.id}`)}
            >
              Cancel
            </Button>
          </BottomSheet>
        </div>
      </form>
    </Form>
  );
}
