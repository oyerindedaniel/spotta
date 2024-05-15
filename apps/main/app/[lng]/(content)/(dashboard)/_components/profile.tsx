"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useControllableState, useUploadThing } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
} from "@repo/ui";
import { updateSchema } from "@repo/validations";

export default function Profile({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const { startUpload, isUploading, progress } = useUploadThing(
    "profileImageUploader",
  );

  const [files, setFiles] = useControllableState({
    value: "",
    onChange: () => {},
  });

  const { firstName, lastName, phone, email, picture } = session ?? {};

  type UpdateProfileType = z.infer<typeof updateSchema>;

  const form = useForm<UpdateProfileType>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      picture: undefined,
      firstName,
      lastName,
      email,
      phone: phone ?? "",
    },
  });

  const mutateUpdateUser = api.user.update.useMutation({
    onSuccess: () => {
      form.reset();
      toast({
        variant: "success",
        description: "Update account successful",
      });
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

  const onSubmit = (data: UpdateProfileType) => {
    mutateUpdateUser.mutate(data);
  };

  return (
    <div className="">
      <div>
        <h5>User Profile</h5>
        <p>Update your personal details here</p>
      </div>
      <div className="mx-auto my-6 w-full max-w-[28rem] rounded-lg bg-brand-plain p-4 px-5 shadow-md">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="picture"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="w-full">
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        {/* <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxSize={4 * 1024 * 1024}
                          disabled={isUploading}
                        /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
