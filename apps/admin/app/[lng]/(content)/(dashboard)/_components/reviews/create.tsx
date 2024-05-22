"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
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
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@repo/ui";
import { createReviewSchema } from "@repo/validations";

type CreateReviewType = z.infer<typeof createReviewSchema>;

export default function CreateReview({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateReviewType>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {},
  });

  const mutateCreateReview = api.area.create.useMutation({
    onSuccess: ({ data }) => {
      const { name } = data;
      toast({
        variant: "success",
        description: `Successfully created ${name} area`,
      });
      router.push("/areas");
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

  const onSubmit = async (data: CreateReviewType) => {};

  const isUpdating = mutateCreateReview.isPending;

  return (
    <div className="mx-auto max-w-[35rem]">
      <div className="text-2xl font-medium">Create a new Review</div>
      <div className="my-6 w-full rounded-lg bg-brand-plain p-4 px-5 shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-[600px] flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Area</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Name of Area" {...field} />
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
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
