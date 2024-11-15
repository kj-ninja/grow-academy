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
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  UpdateUserFormSchema,
  UpdateUserFormValues,
} from "@/features/user/forms/UpdateUserProfileForm.schema";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { Textarea } from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "@/features/user/api";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { Controller } from "react-hook-form";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { appendImageToFormData } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { BottomSheet } from "@/components/ui/BottomSheet";

export function UpdateUserProfileForm({
  withBottomSheet,
}: {
  withBottomSheet?: boolean;
}) {
  const { currentUser, refetchUserProfile } = useCurrentUser();
  const { image: avatarImage, setImage: setAvatarImage } = useBinaryImage(
    currentUser?.avatarImage,
  );
  const { image: backgroundImage, setImage: setBackgroundImage } =
    useBinaryImage(currentUser?.backgroundImage);

  const updateUserMutation = useUpdateUserMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = UpdateUserFormSchema.useForm({
    defaultValues: {
      username: currentUser?.username,
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      bio: currentUser?.bio || "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (values: UpdateUserFormValues) => {
    const formData = new FormData();

    if (currentUser) {
      formData.append("id", String(currentUser.id));
      formData.append("username", currentUser.username);
      formData.append("role", currentUser.role);
      formData.append("createdAt", String(currentUser.createdAt));
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("bio", values.bio || "");

      appendImageToFormData(
        formData,
        "avatarImage",
        values.avatarImage,
        currentUser.avatarImage?.data,
      );
      appendImageToFormData(
        formData,
        "backgroundImage",
        values.backgroundImage,
        currentUser.backgroundImage?.data,
      );

      try {
        await updateUserMutation.mutateAsync(formData);
        await refetchUserProfile();

        navigate(`/user/${currentUser.username}`);
      } catch (error) {
        toast({
          title: "Error updating user",
          description: "An error occurred while updating your profile.",
        });
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <>
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
          <div className="p-6 mt-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} disabled />
                  </FormControl>
                  <FormDescription>Your unique identifier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 justify-stretch">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Update your bio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormRootError />

            {withBottomSheet ? (
              <BottomSheet>
                <Button
                  type="submit"
                  className="w-[120px]"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  className="w-[120px]"
                  variant="outline"
                  onClick={() => navigate(`/user/${currentUser?.username}`)}
                >
                  Cancel
                </Button>
              </BottomSheet>
            ) : (
              <Button
                type="submit"
                className="w-full mt-8"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
