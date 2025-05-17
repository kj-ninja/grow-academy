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
import { Button } from "@/components/ui/Button";
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
import { useEffect, useState } from "react";
import { useCreateClassroomMutation } from "@/features/classroom/api/mutations";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { InputWithAsyncValidation } from "@/components/ui/InputWithAsyncValidation";
import { Textarea } from "@/components/ui/Textarea";

enum FormStep {
  INFO = "info",
  PRIVACY = "privacy",
}

export function CreateClassroomForm({ onSuccess }: { onSuccess: () => void }) {
  const { image: avatarImage, setImage: setAvatarImage } = useBinaryImage();
  const { image: backgroundImage, setImage: setBackgroundImage } = useBinaryImage();
  const [formStep, setFormStep] = useState(FormStep.INFO);

  const createClassroomMutation = useCreateClassroomMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = CreateClassroomFormSchema.useForm({
    defaultValues: {
      classroomName: "",
      handle: "",
      description: "",
      tags: [],
      accessType: "Public",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const classroomName = form.watch("classroomName");
  const [debouncedClassroomName] = useDebounce(classroomName);

  const classroomHandle = form.watch("handle");
  const [debouncedHandle] = useDebounce(classroomHandle);

  const classroomNameQuery = useQuery({
    ...ClassroomQueries.validateName(debouncedClassroomName),
    enabled: debouncedClassroomName !== "" && debouncedClassroomName.length > 1,
  });

  const classroomHandleQuery = useQuery({
    ...ClassroomQueries.validateHandle(debouncedHandle),
    enabled: debouncedHandle !== "" && debouncedHandle.length > 1,
  });

  useEffect(() => {
    if (classroomNameQuery.isError) {
      form.setError("classroomName", {
        type: "custom",
        message: "This Classroom Name is already taken.",
      });
    }
    if (classroomHandleQuery.isError) {
      form.setError("handle", {
        type: "custom",
        message: "This Handle is already taken.",
      });
    }
  }, [classroomNameQuery.isError, classroomHandleQuery.isError, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "classroomName" && value.classroomName) {
        const handle = value.classroomName
          .replace(/[^a-zA-Z0-9_ ]/g, "")
          .split(" ")
          .join("_");
        form.setValue("handle", handle, { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (values: CreateClassroomFormValues) => {
    const formData = new FormData();

    formData.append("classroomName", values.classroomName);
    formData.append("handle", values.handle);
    formData.append("description", values.description || "");
    formData.append("accessType", values.accessType);

    if (values.tags) {
      formData.append("tags", JSON.stringify(values.tags));
    }

    appendImageToFormData(formData, "avatarImage", values.avatarImage);
    appendImageToFormData(formData, "backgroundImage", values.backgroundImage);

    try {
      const response = await createClassroomMutation.mutateAsync(formData);
      navigate(`/classroom/${response.id}`);
      onSuccess();
    } catch (error) {
      // todo: add errors to forms
      toast({
        title: "Error creating classroom",
        description: "An error occurred while creating the classroom.",
      });
      console.error("Error creating classroom:", error);
    }
  };

  const isContinueDisabled =
    classroomHandleQuery.isError ||
    classroomNameQuery.isError ||
    !form.formState.isValid ||
    form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {formStep === FormStep.INFO ? (
            <>
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
              <div className="mt-8 p-6">
                <FormField
                  control={form.control}
                  name="classroomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Name</FormLabel>
                      <FormControl>
                        <InputWithAsyncValidation
                          {...field}
                          placeholder="Classroom Name"
                          isLoading={classroomNameQuery.isLoading}
                          isValid={classroomNameQuery.data?.success}
                          validMessage="This name is available"
                          isCheckError={classroomNameQuery.isError}
                          className="pb-5"
                        />
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
                        <InputWithAsyncValidation
                          {...field}
                          placeholder="Classroom Handle"
                          isLoading={classroomHandleQuery.isLoading}
                          isValid={classroomHandleQuery.data?.success}
                          validMessage="This handle is available"
                          isCheckError={classroomHandleQuery.isError}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Your classroom unique identifier</FormDescription>
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

                <Button
                  type="button"
                  className="mt-8 w-full"
                  onClick={() => {
                    setFormStep(FormStep.PRIVACY);
                  }}
                  disabled={isContinueDisabled}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-4 p-6">
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
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setFormStep(FormStep.INFO)}
                >
                  Go Back
                </Button>
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  Create Classroom
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
