"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
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
  useToast,
} from "@repo/ui";
import { createAmenitySchema } from "@repo/validations";

type CreateAmenityType = z.infer<typeof createAmenitySchema>;

type AmenityOutputType = RouterOutputs["amenity"]["findById"]["data"];

type Props = {
  lng: LanguagesType;
} & (
  | {
      type: "create";
    }
  | {
      type: "edit";
      amenity: AmenityOutputType;
    }
);

export default function CreateEditAmenity({
  lng,
  type,
  ...props
}: Props): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const router = useRouter();
  const { toast } = useToast();

  const amenity = (props as { amenity: AmenityOutputType }).amenity;
  const asEdit = !!(type === "edit" && amenity);

  const { isPending, isError, data } = api.amenity.findAllCatergory.useQuery(
    undefined,
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  const categories = data?.data;

  const defaultCategory = asEdit
    ? {
        id: amenity.category.id,
        name: amenity.category.name,
      }
    : {};

  const form = useForm<CreateAmenityType>({
    resolver: zodResolver(createAmenitySchema),
    defaultValues: {
      name: asEdit ? amenity.name : "",
      category: defaultCategory,
    },
  });

  const mutateCreateAmenity = api.amenity.create.useMutation({
    onSuccess: ({ data }) => {
      form.reset();
      toast({
        variant: "success",
        description: `Successfully created amenity`,
      });
      router.push("/amenities");
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

  const mutateUpdateamenity = api.amenity.update.useMutation({
    onSuccess: ({ data }) => {
      toast({
        variant: "success",
        description: `Successfully updated amenity`,
      });
      router.push("/amenities");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message ?? "Error updating amenity. Try again",
      });
      console.error(error);
      router.refresh();
    },
  });

  const onSubmit = async (data: CreateAmenityType) => {
    if (asEdit) {
      mutateUpdateamenity.mutate({ ...data, id: amenity.id });
      return;
    }

    mutateCreateAmenity.mutate(data);
  };

  const isUpdating =
    mutateCreateAmenity.isPending || mutateUpdateamenity.isPending;

  return (
    <div className="mx-auto max-w-[35rem]">
      <div className="text-2xl font-medium">
        {asEdit ? "Edit" : "Create a new"} Amenity
      </div>
      <div className="my-6 w-full rounded-lg bg-brand-plain p-4 px-5 shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-[600px] flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Amenity</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter amenity name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={() => (
                <>
                  <Popover>
                    <div>
                      <PopoverTrigger asChild className="h-11 w-full">
                        <Button
                          variant="unstyled"
                          className="flex items-center justify-between bg-brand-primary font-normal text-gray-500"
                        >
                          {isPending ? (
                            <span>loading categories...</span>
                          ) : isError ? (
                            <span>Error occurred</span>
                          ) : (
                            <span>Select Categories</span>
                          )}
                          <div>
                            <ChevronDownIcon />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="grid max-h-[300px] max-w-[33rem] grid-cols-4 gap-x-2 overflow-y-auto rounded-lg">
                        {categories &&
                          categories.map((category) => (
                            <FormField
                              key={category.id}
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem
                                  key={category.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <FormControl>
                                    <Checkbox
                                      className="mt-2"
                                      checked={
                                        !!(field?.value?.id === category?.id)
                                      }
                                      onCheckedChange={(checked) => {
                                        checked
                                          ? field.onChange({
                                              ...category,
                                            })
                                          : field.onChange({});
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {category.name}
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
