"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/assets";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@prisma/client";
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
  GithubButton,
  GoogleButton,
  Input,
} from "@repo/ui";
import { loginSchema } from "@repo/validations";

import AuthSeparator from "../_components/separator";

type Login = z.infer<typeof loginSchema>;

export default function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const code = searchParams?.get?.("code");
  const authService = searchParams?.get?.("authService") as AuthService;
  const redirectUrl = searchParams?.get?.("state");

  console.log({ code });
  console.log({ authService });

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

  const mutateGoogleOauthLogin = api.user.googleoauth.useMutation({
    onSuccess: (data) => {
      form.reset();
      console.log(data.data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutateGithubOauthLogin = api.user.githuboauth.useMutation({
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

  const onSubmit = (data: Login) => {
    mutateLogin.mutate(data);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (authService?.toUpperCase() === "GOOGLE" && code) {
        mutateGoogleOauthLogin.mutate({ code });
      }

      if (authService?.toUpperCase() === "GITHUB" && code) {
        console.log("here");
        mutateGithubOauthLogin.mutate({ code });
      }
    }
  }, [pathname, code, redirectUrl]);

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
          <AuthSeparator>{"Or"}</AuthSeparator>
          <GoogleButton
            className="flex gap-3 border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={mutateGoogleOauthLogin.isPending}
          >
            <Image alt="Spotta" height={25} src={Icons.google} width={25} />
            {mutateGoogleOauthLogin.isPending ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Log in with Google"
            )}
          </GoogleButton>
          <GithubButton
            className="flex gap-3 border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={false}
          >
            <div>
              <Image
                alt="Github"
                className="block dark:hidden"
                height={25}
                src={Icons.github}
                width={25}
              />
              <Image
                alt="Github"
                className="hidden dark:block"
                height={25}
                src={Icons.githubDark}
                width={25}
              />
            </div>
            {"Log in with Github"}
          </GithubButton>
        </form>
      </Form>
    </div>
  );
}
