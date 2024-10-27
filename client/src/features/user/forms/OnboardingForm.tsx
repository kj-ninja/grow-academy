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
  OnboardingFormSchema,
  OnboardingFormValues,
} from "@/features/user/forms/OnboardingForm.schema";
import { useAuthState } from "@/features/auth/stores/authStore";
import { ApiClient } from "@/services/ApiClient";
import { useBinaryImage } from "@/features/user/hooks/useBinaryImage";
import { Textarea } from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";

export function OnboardingForm() {
  const { user } = useAuthState();
  const { image, setImage } = useBinaryImage(user?.avatarImage || "");

  const navigate = useNavigate();

  const form = OnboardingFormSchema.useForm({
    defaultValues: {
      username: user?.username ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      bio: user?.bio || "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (values: OnboardingFormValues) => {
    const formData = new FormData();

    if (user) {
      formData.append("id", String(user.id));
      formData.append("username", user.username);
      formData.append("role", user.role);
      formData.append("createdAt", String(user.createdAt));
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("bio", values.bio || "");
      formData.append("isActive", String(user.isActive));

      if (values.avatarImage instanceof File) {
        formData.append("avatarImage", values.avatarImage);
      }

      try {
        await ApiClient.put(`/user/update/${user.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        navigate("/");
      } catch (error) {
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
    setImage("");
    form.setValue("avatarImage", "");
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
