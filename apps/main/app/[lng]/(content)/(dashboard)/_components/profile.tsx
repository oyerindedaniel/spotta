"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@repo/api/src/react";
import { useUploadThing } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { UserDTO, UserDTOWithContact } from "@repo/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FileUploader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  UncontrolledFormMessage,
  useToast,
} from "@repo/ui";
import { getInitials, separateMediaFilesAndUrls } from "@repo/utils";
import { updateSchema } from "@repo/validations";

export default function Profile({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserDTO;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const requiredMessage = "Input not instance of File";

  const { startUpload, isUploading, progresses } = useUploadThing(
    "profileImageUploader",
  );

  const { firstName, lastName, phone, email, picture } =
    (session as UserDTOWithContact) ?? {};

  const defaultPicture = new Array(picture).filter(Boolean);

  const pictures =
    defaultPicture.length > 0 ? (defaultPicture as Array<string>) : undefined;

  type UpdateProfileType = z.infer<typeof updateSchema>;

  const form = useForm<UpdateProfileType>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      picture: pictures,
      firstName,
      lastName,
      email,
      phone: phone ?? "",
    },
  });

  const formPictureError = form.formState.errors.picture;

  const mutateUpdateUser = api.user.update.useMutation({
    onSuccess: ({ data }) => {
      const { isConfirmed } = data;
      toast({
        variant: "success",
        description: "Update account successful",
      });
      router.push(isConfirmed ? "/profile" : "/");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error(error);
      router.refresh();
    },
  });

  const onSubmit = async (data: UpdateProfileType) => {
    const { hasFile, mediaFiles } = separateMediaFilesAndUrls(data.picture);
    try {
      const profileImgUrl = hasFile
        ? (await startUpload(mediaFiles))?.map((data) => data.url)
        : pictures;
      mutateUpdateUser.mutate({
        ...data,
        picture: profileImgUrl as Array<string>,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.message ?? "Error updating profile",
      });
    }
  };

  const isUpdating = isUploading || mutateUpdateUser.isPending;

  return (
    <div className="mx-auto max-w-[35rem]">
      <div>
        <h5 className="mb-1 text-2xl font-semibold">User Profile</h5>
        <p className="text-sm">Update your personal details here</p>
      </div>
      <div className="mx-auto my-6 w-full rounded-lg bg-brand-plain p-4 px-5 shadow-md">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-6"
            >
              <div className="flex justify-between gap-3">
                <Avatar className="size-16 self-start">
                  <AvatarImage
                    className="object-cover"
                    src={picture ?? ""}
                    alt={`@${firstName}`}
                  />
                  <AvatarFallback>
                    {getInitials(`${firstName} ${lastName}`)}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <div className="space-y-6">
                      <FormItem className="w-full">
                        <FormControl>
                          <FileUploader
                            value={field.value}
                            onValueChange={field.onChange}
                            maxSize={4 * 1024 * 1024}
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <UncontrolledFormMessage
                          message={
                            formPictureError &&
                            formPictureError?.message?.toLowerCase() ===
                              requiredMessage?.toLowerCase()
                              ? `Image is required`
                              : formPictureError?.message
                          }
                        />
                      </FormItem>
                    </div>
                  )}
                />
              </div>
              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-[50%]">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-[50%]">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        // pattern="[0-9]"
                        placeholder="Phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="mt-3 w-full uppercase"
                type="submit"
                size="lg"
                disabled={isUpdating}
              >
                {isUpdating && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
