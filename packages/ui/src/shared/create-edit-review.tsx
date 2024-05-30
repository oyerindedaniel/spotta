"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import { createReviewSchema } from "@repo/validations";
import {
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StarRating,
  Textarea,
  useToast,
} from "..";

type CreateReviewType = z.infer<typeof createReviewSchema>;

type ReviewsOutputType = RouterOutputs["review"]["findById"]["data"];

type Props = {
  lng: LanguagesType;
} & (
  | {
      type: "create";
      intent: "modal";
      areaId: string;
      onClose: () => void;
    }
  | {
      type: "edit";
      review: ReviewsOutputType;
      intent: "modal";
      areaId: string;
      onClose: () => void;
    }
  | {
      type: "create";
      intent: "normal";
    }
  | {
      type: "edit";
      review: ReviewsOutputType;
      intent: "normal";
    }
);

export function CreateEditReview({
  lng,
  type,
  intent,
  ...props
}: Props): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const router = useRouter();
  const { toast } = useToast();

  const review = (props as { review: ReviewsOutputType }).review;
  const areaId = (props as { areaId: string }).areaId;
  const onClose = (props as { onClose: () => void }).onClose;
  const asEdit = !!(type === "edit" && review);

  const { isPending, isError, data } = api.amenity.findAll.useQuery();

  const {
    isPending: isPendingAreas,
    isError: isErrorAreas,
    data: dataAreas,
  } = api.area.findAllNoInclude.useQuery(undefined, {
    enabled: intent === "normal",
  });

  const amenities = data?.data;
  const areas = dataAreas?.data;

  const defaultAmenities = asEdit
    ? review.amenities.map((amenity) => ({
        id: amenity.id,
        name: amenity.name,
        category: { id: amenity.category.id, name: amenity.category.name },
      }))
    : [];

  const form = useForm<CreateReviewType>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      areaId: asEdit ? review.areaId : "",
      amenities: defaultAmenities,
      rating: asEdit ? String(review.rating) : "",
      description: asEdit ? review.description : "",
      asAnonymous: asEdit ? !!review.asAnonymous : false,
    },
  });

  const mutateCreateReview = api.review.create.useMutation({
    onSuccess: ({ data }) => {
      form.reset();
      intent === "modal" && onClose();
      toast({
        variant: "success",
        description: `Successfully created review`,
      });

      intent === "normal" && router.push("/reviews");

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

  const mutateUpdateReview = api.review.updateAdmin.useMutation({
    onSuccess: ({ data }) => {
      intent === "modal" && onClose();
      toast({
        variant: "success",
        description: `Successfully updated review`,
      });
      {
        intent === "normal" && router.push("/reviews");
      }
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message ?? "Error updating review. Try again",
      });
      console.error(error);
      router.refresh();
    },
  });

  useEffect(() => {
    if (intent === "modal") {
      form.setValue("areaId", areaId);
    }
  }, [intent]);

  const onSubmit = async (data: CreateReviewType) => {
    if (asEdit) {
      mutateUpdateReview.mutate({ ...data, id: review.id });
      return;
    }

    mutateCreateReview.mutate(data);
  };

  const isUpdating =
    mutateCreateReview.isPending || mutateUpdateReview.isPending;

  return (
    <div className={cn("", intent === "normal" && "mx-auto max-w-[35rem]")}>
      {intent === "normal" && (
        <div className="text-2xl font-medium">
          {asEdit ? "Edit" : "Create a new"} Review
        </div>
      )}
      <div
        className={cn(
          "w-full",
          intent === "normal" &&
            "my-6 rounded-lg shadow-md bg-brand-plain p-4 px-5"
        )}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-[600px] flex-col gap-4"
          >
            {intent === "normal" && (
              <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel>Name of area</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="h-11">
                        <FormControl>
                          <Button
                            variant="unstyled"
                            role="combobox"
                            className={cn(
                              "w-full justify-between bg-brand-primary font-normal text-gray-500",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {isPendingAreas ? (
                              <span>loading areas...</span>
                            ) : isErrorAreas ? (
                              <span>Error occurred</span>
                            ) : field.value && areas ? (
                              areas.find((area) => area.id === field.value)
                                ?.name
                            ) : (
                              "Select area"
                            )}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="max-h-[300px] w-[33rem] rounded-lg p-0">
                        <Command className="w-full">
                          <CommandInput
                            placeholder="Search areas..."
                            className="h-9"
                          />
                          <CommandEmpty>No area found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {areas &&
                                areas.map((area) => (
                                  <CommandItem
                                    value={area.name}
                                    key={area.id}
                                    onSelect={() => {
                                      form.setValue("areaId", area.id);
                                    }}
                                  >
                                    {area.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        area.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                          {isPending ? (
                            <span>loading amenities...</span>
                          ) : isError ? (
                            <span>Error occurred</span>
                          ) : (
                            <span>Select Amenities</span>
                          )}
                          <div>
                            <ChevronDownIcon />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="grid max-h-[300px] max-w-[33rem] grid-cols-4 gap-x-2 overflow-y-auto rounded-lg">
                        {amenities &&
                          amenities.map((amenity) => (
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
                                        (value) => value.id === amenity.id
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
                                                  value.id !== amenity.id
                                              )
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
                      defaultRating={Number(field?.value || 0)}
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
              {asEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
