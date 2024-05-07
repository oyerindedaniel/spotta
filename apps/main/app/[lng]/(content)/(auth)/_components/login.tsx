"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/assets";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService, User } from "@prisma/client";
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
  useToast,
} from "@repo/ui";
import { generateAndValidateState } from "@repo/utils";
import { loginSchema } from "@repo/validations";

import AuthSeparator from "./separator";

type LoginType = z.infer<typeof loginSchema>;

export default function Login({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const { validate } = generateAndValidateState();

  const code = searchParams?.get?.("code");
  const authService = searchParams
    ?.get?.("authService")
    ?.toUpperCase() as AuthService;

  const state = searchParams?.get?.("state"); // For OAuth
  const redirectUrl = searchParams?.get?.("redirectUrl");

  const { isValid, redirectUrl: redirectUrlState } = validate(state ?? "");

  const { t, i18n } = useClientTranslation({ lng });

  const mutateLogin = api.auth.login.useMutation({
    onSuccess: (data) => {
      const { isConfirmed } = data.data;
      form.reset();
      router.push(true ? redirectUrl ?? "/" : "/email-confirmation");
      router.refresh();
      toast({
        variant: "success",
        description: "Login successful",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "",
      });
      router.refresh();
    },
  });

  const mutateGoogleOauthLogin = api.user.googleoauth.useMutation({
    onSuccess: (data) => {
      form.reset();
      toast({
        description: "Login successful",
      });
      router.push(redirectUrlState ?? "/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutateGithubOauthLogin = api.user.githuboauth.useMutation({
    onSuccess: (data) => {
      form.reset();
      toast({
        description: "Login successful",
      });
      router.push(redirectUrlState ?? "/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginType) => {
    mutateLogin.mutate(data);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!code || !isValid) return;

      if (authService === "GOOGLE") {
        mutateGoogleOauthLogin.mutate({ code });
      }

      if (authService === "GITHUB") {
        mutateGithubOauthLogin.mutate({ code });
      }
    }
  }, [pathname, code, isValid, authService]);

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
