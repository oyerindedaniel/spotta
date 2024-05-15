"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUploadThing } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import {
  FileUploader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui";
import { updateSchema } from "@repo/validations";

export default function Profile({ lng }: { lng: LanguagesType }) {
  const { startUpload, isUploading, progress } = useUploadThing(
    "profileImageUploader",
  );

  type UpdateProfileType = z.infer<typeof updateSchema>;

  const form = useForm<UpdateProfileType>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      picture: undefined,
    },
  });

  const onSubmit = (data: UpdateProfileType) => {};

  return (
    <div className="w-full">
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
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFiles={1}
                          maxSize={4 * 1024 * 1024}
                          disabled={isUploading}
                        />
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
