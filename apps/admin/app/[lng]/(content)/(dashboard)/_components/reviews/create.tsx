"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { ChevronDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StarRating,
  Textarea,
  useToast,
} from "@repo/ui";
import { createReviewSchema } from "@repo/validations";

type CreateReviewType = z.infer<typeof createReviewSchema>;

const amenities = [
  {
    id: "1",
    name: "Swimming Pool",
    category: {
      id: "c1",
      name: "Recreation",
    },
  },
  {
    id: "2",
    name: "Gym",
    category: {
      id: "c1",
      name: "Recreation",
    },
  },
  {
    id: "3",
    name: "Free Wi-Fi",
    category: {
      id: "c2",
      name: "Utilities",
    },
  },
  {
    id: "4",
    name: "Parking",
    category: {
      id: "c3",
      name: "Facilities",
    },
  },
  {
    id: "5",
    name: "Spa",
    category: {
      id: "c4",
      name: "Wellness",
    },
  },
] as const;

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

  const onSubmit = async (data: CreateReviewType) => {
    console.log(data);
  };

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
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Area</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name of Area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <>
                  <Popover>
                    <div className="relative">
                      <PopoverTrigger asChild className="h-11 w-full">
                        <Button
                          variant="unstyled"
                          className="flex items-center justify-between bg-brand-primary font-normal text-gray-500"
                        >
                          Select Amenities
                          <div>
                            <ChevronDownIcon />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="grid max-h-[300px] max-w-[33rem] grid-cols-4 gap-x-2 overflow-y-auto rounded-lg">
                        {amenities.map((amenity) => (
                          <FormField
                            key={amenity.id}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                              <FormItem
                                key={amenity.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <FormControl>
                                  <Checkbox
                                    className="mt-2"
                                    checked={field.value?.some(
                                      (value) => value.id === amenity.id,
                                    )}
                                    onCheckedChange={(checked) => {
                                      checked
                                        ? field.onChange([
                                            ...(field.value ?? []),
                                            amenity,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) =>
                                                value.id !== amenity.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {amenity.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </PopoverContent>
                    </div>
                  </Popover>
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Location</FormLabel>
                  <FormControl>
                    <StarRating
                      maxRating={5}
                      defaultRating={Number(field.value)}
                      size={20}
                      onSetRating={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Review"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Post as Anonymous</FormLabel>
                  </div>
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
