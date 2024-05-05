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
  const state = searchParams?.get?.("state"); // For OAuth
  const redirectUrl = searchParams?.get?.("redirectUrl");

  const { t, i18n } = useClientTranslation({ lng });

  const mutateLogin = api.auth.login.useMutation({
    onSuccess: (data) => {
      const { isConfirmed } = data.data;
      form.reset();
      router.push(isConfirmed ? redirectUrl ?? "/" : "/email-confirmation");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutateGoogleOauthLogin = api.user.googleoauth.useMutation({
    onSuccess: (data) => {
      form.reset();
      router.push(state ?? "/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutateGithubOauthLogin = api.user.githuboauth.useMutation({
    onSuccess: (data) => {
      form.reset();
      router.push(state ?? "/");
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
        mutateGithubOauthLogin.mutate({ code });
      }
    }
  }, [pathname, code, state]);

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
              <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
            )}
            {mutateLogin.isPending ? "Signing in" : "Sign In"}
          </Button>
          <AuthSeparator>{"Or"}</AuthSeparator>
          <GoogleButton
            className="border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={mutateGoogleOauthLogin.isPending}
          >
            <Image
              alt="Spotta"
              className="mr-3"
              height={25}
              src={Icons.google}
              width={25}
            />
            {mutateGoogleOauthLogin.isPending ? (
              <span className="flex">
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                <span>Signing in with Google</span>
              </span>
            ) : (
              "Log in with Google"
            )}
          </GoogleButton>
          <GithubButton
            className="border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={mutateGithubOauthLogin.isPending}
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
            {mutateGithubOauthLogin.isPending ? (
              <span className="flex w-full items-center">
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                <span>Signing in with Github</span>
              </span>
            ) : (
              "Log in with Github"
            )}
          </GithubButton>
        </form>
      </Form>
    </div>
  );
}
