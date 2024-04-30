"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@repo/ui";
import { registerSchema } from "@repo/validations";

type Register = z.infer<typeof registerSchema>;

export default function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const router = useRouter();

  const { t, i18n } = useClientTranslation({ lng });

  const form = useForm<Register>({
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

  const onSubmit = () => {
    console.log("DANIEL");
  };

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });
  return (
    <div>
      <h5 className="mb-4 text-center text-xl font-medium">Sign Up</h5>
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
                <FormItem className="flex-[50%]">
                  <FormControl>
                    <Input required placeholder="First name" {...field} />
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
                  <FormControl>
                    <Input required placeholder="Last name" {...field} />
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
                    required
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
                    required
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
                  <Input
                    required
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="self-top flex-[50%]">
                <FormControl>
                  <Input
                    required
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center justify-between">
            <p>Already have an account?</p>
            <Button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="m-0 ml-auto inline h-fit p-0 text-[#979797]"
              variant="unstyled"
            >
              Sign in
            </Button>
          </div> */}

          <Button
            className="mt-6 w-full text-base uppercase"
            type="submit"
            size="lg"
            // disabled={mutation.isPending}
          >
            {/* {mutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
}
