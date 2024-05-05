"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@repo/ui";
import { loginSchema } from "@repo/validations";

type Login = z.infer<typeof loginSchema>;

export default function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const router = useRouter();

  const { t, i18n } = useClientTranslation({ lng });

  const mutateLogin = api.auth.login.useMutation({
    onSuccess: (data) => {
      form.reset();
      console.log(data.data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log(form.formState.errors);

  const onSubmit = (data: Login) => {
    mutateLogin.mutate(data);
  };

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });
  return (
    <div>
      <h5 className="mb-6 text-center text-xl font-medium">Sign In</h5>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[600px] flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
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
            name="password"
            render={({ field }) => (
              <FormItem className="flex-[50%]">
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-6 w-full text-base uppercase"
            type="submit"
            size="lg"
            disabled={mutateLogin.isPending}
          >
            {mutateLogin.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}
