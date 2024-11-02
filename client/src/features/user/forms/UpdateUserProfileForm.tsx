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

export function UpdateUserProfileForm() {
  const { currentUser, refetchUserProfile } = useCurrentUser();

  const { image, setImage } = useBinaryImage(currentUser?.avatarImage);

  const updateUserMutation = useUpdateUserMutation();
  const navigate = useNavigate();

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

      if (values.avatarImage instanceof File) {
        formData.append("avatarImage", values.avatarImage);
      } else if (values.avatarImage === null) {
        formData.append("avatarImage", "");
      } else if (currentUser?.avatarImage) {
        const blob = new Blob([new Uint8Array(currentUser.avatarImage.data)], {
          type: "image/jpeg",
        });
        formData.append("avatarImage", blob, "avatar.jpg");
      }

      try {
        await updateUserMutation.mutateAsync({
          data: formData,
        });
        await refetchUserProfile();

        navigate(`/user/${currentUser.username}`);
      } catch (error) {
        // todo: add toast
        console.error("Error updating user:", error);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      form.setValue("avatarImage", file);
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    form.setValue("avatarImage", null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} disabled />
                </FormControl>
                <FormDescription>Your public display name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Textarea placeholder="Update your bio..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatarImage"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="picture">Avatar Image</FormLabel>
                <FormControl>
                  <Input
                    id="picture"
                    type="file"
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormDescription>Upload a profile picture</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full"
              />
              <Button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2"
              >
                Remove Image
              </Button>
            </div>
          )}
          <FormRootError />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
