"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/assets";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@repo/api/src/react";
import { useModal } from "@repo/hooks";
import { LanguagesType, useClientTranslation } from "@repo/i18n";
import {
  AuthSeparator,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  GithubButton,
  GoogleButton,
  Input,
} from "@repo/ui";
import { registerSchema } from "@repo/validations";

type RegisterType = z.infer<typeof registerSchema>;

export default function Register({ lng }: { lng: LanguagesType }): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { onOpen } = useModal();

  const redirectUrl = searchParams?.get?.("redirectUrl");

  const { t, i18n } = useClientTranslation({ lng });

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const mutateCreateUser = api.user.create.useMutation({
    onSuccess: ({ data }) => {
      const { isConfirmed, email } = data;
      form.reset();

      if (isConfirmed) {
        router.push("/login");
      } else {
        onOpen({
          type: "emailConfirmation",
          data: { emailConfirmation: email },
        });
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (data: RegisterType) => {
    mutateCreateUser.mutate(data);
  };

  const isPending = mutateCreateUser.isPending;

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });
  return (
    <div className="mx-auto my-6 w-full max-w-[26rem] rounded-lg bg-brand-plain p-4 px-5 shadow-md">
      <h5 className="mb-6 text-center text-xl font-medium">Sign Up</h5>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[600px] flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
            name="phone"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-6 w-full uppercase"
            type="submit"
            size="lg"
            disabled={isPending}
          >
            {mutateCreateUser.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mutateCreateUser.isPending ? "Signing up" : " Sign Up"}
          </Button>

          <AuthSeparator>{"Or"}</AuthSeparator>
          <GoogleButton
            className="flex gap-3 border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={isPending}
          >
            <Image alt="Google" height={25} src={Icons.google} width={25} />
            {"Sign Up with Google"}
          </GoogleButton>
          <GithubButton
            className="border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={isPending}
          >
            <span className="mr-3 inline-block">
              <Image
                alt="Github"
                className="block dark:hidden"
                height={30}
                src={Icons.github}
                width={30}
              />
              <Image
                alt="Github"
                className="hidden dark:block"
                height={30}
                src={Icons.githubDark}
                width={30}
              />
            </span>
            {"Sign Up with Github"}
          </GithubButton>
        </form>
      </Form>
    </div>
  );
}
