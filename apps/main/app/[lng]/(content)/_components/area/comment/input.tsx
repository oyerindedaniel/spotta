"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
import { api } from "@repo/api/src/react";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  useToast,
} from "@repo/ui";
import { createReviewCommentSchema } from "@repo/validations";

type CreateReviewCommentType = z.infer<typeof createReviewCommentSchema>;

export default function CommentInput({
  lng,
  session,
  review,
}: {
  lng: LanguagesType;
  session: UserDTO;
  review: RouterOutputs["review"]["findById"]["data"];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateReviewCommentType>({
    resolver: zodResolver(createReviewCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    form.setValue("reviewId", review.id);
  }, []);

  const utils = api.useUtils();

  const mutateCreateComment = api.review.createComment.useMutation({
    onSuccess: ({ data }) => {
      form.reset({ comment: "", reviewId: review.id });
      // utils.review.findById.setData(
      //   { id: review.id },
      //   {
      //     data: {
      //       ...review,
      //       _count: {
      //         ...review._count,
      //         comments: review._count.comments + 1,
      //       },
      //     },
      //   },
      //   {},
      // );
      toast({
        variant: "success",
        description: `Successfully created comment`,
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

  const onSubmit = (data: CreateReviewCommentType) => {
    mutateCreateComment.mutate({ ...data, reviewId: review.id });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[600px] flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete=""
                      placeholder="Add a commnent"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="text-base uppercase"
              type="submit"
              size="xs"
              disabled={mutateCreateComment.isPending}
            >
              {mutateCreateComment.isPending && (
                <ReloadIcon className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
