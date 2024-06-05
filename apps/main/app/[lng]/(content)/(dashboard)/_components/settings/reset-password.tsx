"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@repo/api/src/react";
import { LanguagesType } from "@repo/i18n";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@repo/ui";
import { resetPasswordSchema } from "@repo/validations";

type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword({ lng }: { lng: LanguagesType }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutateResetPassword = api.user.resetPassword.useMutation({
    onSuccess: () => {
      form.reset();
      toast({
        variant: "success",
        description: "Reset password successful",
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

  const onSubmit = (data: ResetPasswordType) => {
    mutateResetPassword.mutate(data);
  };

  return (
    <div className="mx-auto my-6 w-full max-w-[28rem] rounded-lg bg-brand-plain p-4 px-5 shadow-md">
      <h5 className="mb-6 text-center text-xl font-medium">Reset Password</h5>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[600px] flex-col gap-4"
        >
          <FormLabel>Old Password</FormLabel>
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Old password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-6 w-full text-base uppercase"
            type="submit"
            size="lg"
            disabled={mutateResetPassword.isPending}
          >
            {mutateResetPassword.isPending && (
              <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
            )}
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
